package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.common.exception.EmptyListException;
import com.flowstruct.api.course.exception.CourseNotFoundException;
import com.flowstruct.api.flowsheet.domain.*;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.exception.CourseExistsException;
import com.flowstruct.api.flowsheet.exception.SectionNotFoundException;
import com.flowstruct.api.flowsheet.utils.CourseGraphUtils;
import com.flowstruct.api.flowsheet.utils.PlacementUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class FlowsheetCourseManagerService {
    private final FlowsheetService flowsheetService;
    private final PlacementUtils placementUtils;
    private final CourseGraphUtils courseGraphUtils;

    @Transactional
    public FlowsheetDto addCoursesToFlowsheet(
            long flowsheetId,
            long sectionId,
            List<Long> courseIds
    ) {
        if (courseIds.isEmpty()) {
            throw new EmptyListException("No courses were found to add");
        }

        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        var section = flowsheet.getSections().stream()
                .filter(s -> s.getId() == sectionId)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Section was not found"));

        Set<SectionCourse> toBeAddedCourses = courseIds
                .stream()
                .filter(courseId -> {
                    boolean alreadyAdded = flowsheet.getSections().stream()
                            .anyMatch(s -> s.hasCourse(courseId));
                    if (alreadyAdded) {
                        throw new CourseExistsException("Course was already added in another section");
                    }
                    return true;
                })
                .map(courseId -> new SectionCourse(AggregateReference.to(courseId)))
                .collect(Collectors.toSet());

        section.getCourses().addAll(toBeAddedCourses);

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto removeCoursesFromFlowsheet(long flowsheetId, List<Long> courseIds) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

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

            placementUtils.deleteCoursePlacement(
                    flowsheet,
                    courseId,
                    flowsheet.getPlacements().get(courseId)
            );
        }

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto linkPrerequisitesToCourse(
            long flowsheetId,
            long courseId,
            List<Long> prerequisites,
            Relation relation
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        courseGraphUtils.validatePrerequisites(courseId, flowsheet, prerequisites);

        for (var prerequisite : prerequisites) {
            flowsheet.getCoursePrerequisites().add(
                    new CoursePrerequisite(
                            AggregateReference.to(courseId),
                            AggregateReference.to(prerequisite),
                            relation
                    )
            );
        }

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto linkCorequisitesToCourse(
            long flowsheetId,
            long courseId,
            List<Long> corequisiteIds
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        for (var corequisiteId : corequisiteIds) {
            flowsheet.getCourseCorequisites().add(
                    new CourseCorequisite(
                            AggregateReference.to(courseId),
                            AggregateReference.to(corequisiteId)
                    )
            );
        }

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto unlinkCorequisitesFromCourse(
            long flowsheetId,
            long courseId,
            long corequisiteId
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        boolean removed = flowsheet.getCourseCorequisites().removeIf(courseCorequisite ->
                courseCorequisite.getCourse().getId() == courseId && courseCorequisite.getCorequisite().getId() == corequisiteId
        );

        if (!removed) throw new CourseNotFoundException("Corequisite not found");

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto unlinkPrerequisitesFromCourse(
            long flowsheetId,
            long courseId,
            long prerequisiteId
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        boolean removed = flowsheet.getCoursePrerequisites().removeIf(coursePrerequisite ->
                coursePrerequisite.getCourse().getId() == courseId
                        && coursePrerequisite.getPrerequisite().getId() == prerequisiteId
        );

        if (!removed) throw new CourseNotFoundException("Prerequisite not found");

        return flowsheetService.saveAndMap(flowsheet);
    }

    @Transactional
    public FlowsheetDto moveCourseToSection(
            long flowsheetId,
            List<Long> courseIds,
            long targetSectionId
    ) {
        var flowsheet = flowsheetService.findOrThrow(flowsheetId);

        var targetSection = flowsheet.getSections().stream()
                .filter(section -> section.getId() == targetSectionId)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Target section not found"));

        for (long courseId : courseIds) {
            flowsheet.getSections().forEach(section -> section.removeCourse(courseId));

            if (targetSection.getType() == SectionType.Elective || targetSection.getType() == SectionType.Remedial) {
                flowsheet.getPlacements().remove(courseId);
            }

            targetSection.addCourse(courseId);
        }

        return flowsheetService.saveAndMap(flowsheet);
    }
}
