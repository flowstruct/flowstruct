package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.Placement;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.dto.PlacementDto;
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

        List<Placement> termPlacements = flowsheet.getPlacements()
                .stream()
                .filter(p -> p.getTerm() == term)
                .toList();

        Map<Long, Placement> placementsByCourse = flowsheet.getPlacementsByCourse();

        for (var placement : termPlacements) {
            placement.setPosition(placement.getPosition() + courseIds.size());
        }

        int firstPosition = 0;

        for (var courseId : courseIds) {
            if (placementsByCourse.containsKey(courseId)) {
                throw new CourseAlreadyPlacedException("Course is already placed.");
            }

            Placement newPlacement = new Placement(
                    AggregateReference.to(courseId),
                    term,
                    ++firstPosition,
                    1
            );

            flowsheet.getPlacements().add(newPlacement);
        }

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto movePlacement(
            long flowsheetId,
            long courseId,
            PlacementDto targetPlacement
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        var placementsMap = flowsheet.getPlacementsByCourse();

        var oldPlacement = placementsMap.get(courseId);
        var newPlacement = new Placement(
                AggregateReference.to(courseId),
                targetPlacement.term(),
                targetPlacement.position(),
                targetPlacement.span()
        );

        if (oldPlacement == null) {
            throw new CourseNotPlacedException("Course has no initial placement.");
        }

        if (placementUtils.comparePlacement(oldPlacement, newPlacement) == 0
                && oldPlacement.getPosition() == newPlacement.getPosition()) {
            throw new InvalidCoursePlacement("Course is already in the same placement.");
        }

        boolean prerequisitesFulfilled = flowsheet.getCoursePrerequisites()
                .stream()
                .filter(cp -> Objects.equals(cp.getCourse().getId(), courseId))
                .allMatch(cp -> {
                    var prerequisitePlacement = placementsMap.get(cp.getPrerequisite().getId());

                    if (prerequisitePlacement == null) {
                        return true;
                    }

                    return placementUtils.comparePlacement(prerequisitePlacement, newPlacement) < 0;
                });

        if (!prerequisitesFulfilled) {
            throw new InvalidCoursePlacement("Invalid course movement.");
        }

        boolean postrequisitesFulfilled = flowsheet.getCoursePrerequisites()
                .stream()
                .filter(cp -> Objects.equals(cp.getPrerequisite().getId(), courseId))
                .allMatch(cp -> {
                    var postrequisitePlacement = placementsMap.get(cp.getCourse().getId());

                    if (postrequisitePlacement == null) {
                        return true;
                    }

                    return placementUtils.comparePlacement(postrequisitePlacement, newPlacement) > 0;
                });

        if (!postrequisitesFulfilled) {
            throw new InvalidCoursePlacement("Cannot move course to this term.");
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
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);
        var placementsMap = flowsheet.getPlacementsByCourse();

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

            placementUtils.deleteCoursePlacement(flowsheet, placementsMap.get(courseId));
        }

        return flowsheetService.saveAndMap(flowsheet);
    }
}
