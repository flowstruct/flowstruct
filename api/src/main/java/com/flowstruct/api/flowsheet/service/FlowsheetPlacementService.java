package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.Placement;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.exception.CourseAlreadyPlacedException;
import com.flowstruct.api.flowsheet.exception.CourseNotPlacedException;
import com.flowstruct.api.flowsheet.exception.InvalidCoursePlacement;
import com.flowstruct.api.flowsheet.exception.InvalidSpanException;
import com.flowstruct.api.flowsheet.utils.PlacementUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class FlowsheetPlacementService {
    private final FlowsheetService flowsheetService;
    private final PlacementUtils placementUtils;

    @Transactional
    public FlowsheetDto placeCourses(long flowsheetId, List<Long> courseIds, int term) {
        Flowsheet flowsheet = flowsheetService.findOrThrow(flowsheetId);

        Map<Long, Placement> placementsByCourse = flowsheet.getPlacementsByCourse();

        for (var courseId : courseIds) {
            if (placementsByCourse.containsKey(courseId)) {
                throw new CourseAlreadyPlacedException("Course is already placed.");
            }
        }

        List<Placement> termPlacements = flowsheet.getPlacements()
                .stream()
                .filter(p -> p.getTerm() == term)
                .toList();

        int delta = courseIds.size();

        for (var placement : termPlacements) {
            placement.setPosition(placement.getPosition() + delta);
        }

        int position = 1;
        for (var courseId : courseIds) {
            Placement newPlacement = new Placement(
                    AggregateReference.to(courseId),
                    term,
                    position++,
                    1
            );
            flowsheet.getPlacements().add(newPlacement);
        }

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto moveCourse(
            long flowsheetId,
            long courseId,
            int targetTerm,
            int targetPosition
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        var placementsByCourse = flowsheet.getPlacementsByCourse();

        var oldPlacement = placementsByCourse.get(courseId);

        if (oldPlacement == null) {
            throw new CourseNotPlacedException("Course has no initial placement.");
        }

        var newPlacement = new Placement(
                AggregateReference.to(courseId),
                targetTerm,
                targetPosition,
                oldPlacement.getSpan()
        );


        if (placementUtils.comparePlacement(oldPlacement, newPlacement) == 0
                && oldPlacement.getPosition() == newPlacement.getPosition()) {
            throw new InvalidCoursePlacement("Course is already in the same placement.");
        }

        boolean prerequisitesFulfilled = flowsheet.getCoursePrerequisites()
                .stream()
                .filter(cp -> Objects.equals(cp.getCourse().getId(), courseId))
                .allMatch(cp -> {
                    var prerequisitePlacement = placementsByCourse.get(cp.getPrerequisite().getId());

                    if (prerequisitePlacement == null) {
                        return true;
                    }

                    return placementUtils.comparePlacement(prerequisitePlacement, newPlacement) < 0;
                });

        if (!prerequisitesFulfilled) {
            throw new InvalidCoursePlacement("Course must come after its prerequisites.");
        }

        boolean postrequisitesFulfilled = flowsheet.getCoursePrerequisites()
                .stream()
                .filter(cp -> Objects.equals(cp.getPrerequisite().getId(), courseId))
                .allMatch(cp -> {
                    var postrequisitePlacement = placementsByCourse.get(cp.getCourse().getId());

                    if (postrequisitePlacement == null) {
                        return true;
                    }

                    return placementUtils.comparePlacement(postrequisitePlacement, newPlacement) > 0;
                });

        if (!postrequisitesFulfilled) {
            throw new InvalidCoursePlacement("Course must come before its postrequisites.");
        }

        placementUtils.deleteCoursePlacement(flowsheet, oldPlacement);
        placementUtils.insertCoursePlacement(flowsheet, newPlacement);

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto resizePlacement(long flowsheetId, long courseId, int span) {
        if (span < 1 || span > 5) {
            throw new InvalidSpanException("A course cannot span less than 1 or larger than 5 courses.");
        }

        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        var placementsMap = flowsheet.getPlacementsByCourse();
        var coursePlacement = placementsMap.get(courseId);

        if (coursePlacement == null) {
            throw new CourseNotPlacedException("Course not placed in a term");
        }

        coursePlacement.setSpan(span);

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto removePlacements(long flowsheetId, List<Long> courseIds) {
        Flowsheet flowsheet = flowsheetService.findOrThrow(flowsheetId);
        Map<Long, Placement> placementsByCourse = flowsheet.getPlacementsByCourse();

        for (var courseId : courseIds) {
            flowsheet.getSections().forEach(section -> section.removeCourse(courseId));

            flowsheet.getCoursePrerequisites().removeIf(coursePrerequisite ->
                    Objects.equals(coursePrerequisite.getCourse().getId(), courseId)
                            || Objects.equals(coursePrerequisite.getPrerequisite().getId(), courseId)
            );

            flowsheet.getCourseCorequisites().removeIf(coursePrerequisite ->
                    Objects.equals(coursePrerequisite.getCourse().getId(), courseId)
                            || Objects.equals(coursePrerequisite.getCorequisite().getId(), courseId)
            );

            placementUtils.deleteCoursePlacement(flowsheet, placementsByCourse.get(courseId));
        }

        return flowsheetService.saveAndMap(flowsheet);
    }
}
