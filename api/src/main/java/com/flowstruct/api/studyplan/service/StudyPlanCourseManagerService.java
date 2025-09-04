package com.flowstruct.api.studyplan.service;

import com.flowstruct.api.common.exception.EmptyListException;
import com.flowstruct.api.course.exception.CourseNotFoundException;
import com.flowstruct.api.studyplan.domain.*;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import com.flowstruct.api.studyplan.exception.CourseExistsException;
import com.flowstruct.api.studyplan.exception.SectionNotFoundException;
import com.flowstruct.api.studyplan.utils.CourseGraphUtils;
import com.flowstruct.api.studyplan.utils.ProgramMapUtils;
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
public class StudyPlanCourseManagerService {
    private final StudyPlanService studyPlanService;
    private final ProgramMapUtils programMapUtils;
    private final CourseGraphUtils courseGraphUtils;

    @Transactional
    public StudyPlanDto addCoursesToStudyPlan(
            long studyPlanId,
            long sectionId,
            List<Long> courseIds
    ) {
        if (courseIds.isEmpty()) {
            throw new EmptyListException("No courses were found to add");
        }

        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        var section = studyPlan.getSections().stream()
                .filter(s -> s.getId() == sectionId)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Section was not found"));

        Set<SectionCourse> toBeAddedCourses = courseIds
                .stream()
                .filter(courseId -> {
                    boolean alreadyAdded = studyPlan.getSections().stream()
                            .anyMatch(s -> s.hasCourse(courseId));
                    if (alreadyAdded) {
                        throw new CourseExistsException("Course was already added in another section");
                    }
                    return true;
                })
                .map(courseId -> new SectionCourse(AggregateReference.to(courseId)))
                .collect(Collectors.toSet());

        section.getCourses().addAll(toBeAddedCourses);

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto removeCoursesFromStudyPlan(long studyPlanId, List<Long> courseIds) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        for (var courseId : courseIds) {
            studyPlan.getSections().forEach(section -> section.removeCourse(courseId));

            studyPlan.getCoursePrerequisites().removeIf(coursePrerequisite ->
                    Objects.equals(coursePrerequisite.getCourse().getId(), courseId)
                            || Objects.equals(coursePrerequisite.getPrerequisite().getId(), courseId)
            );

            studyPlan.getCourseCorequisites().removeIf(coursePrerequisite ->
                    Objects.equals(coursePrerequisite.getCourse().getId(), courseId)
                            || Objects.equals(coursePrerequisite.getCorequisite().getId(), courseId)
            );

            programMapUtils.deleteCoursePlacement(
                    studyPlan,
                    courseId,
                    studyPlan.getCoursePlacements().get(courseId)
            );
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto linkPrerequisitesToCourse(
            long studyPlanId,
            long courseId,
            List<Long> prerequisites,
            Relation relation
    ) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        courseGraphUtils.validatePrerequisites(courseId, studyPlan, prerequisites);

        for (var prerequisite : prerequisites) {
            studyPlan.getCoursePrerequisites().add(
                    new CoursePrerequisite(
                            AggregateReference.to(courseId),
                            AggregateReference.to(prerequisite),
                            relation
                    )
            );
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto linkCorequisitesToCourse(
            long studyPlanId,
            long courseId,
            List<Long> corequisiteIds
    ) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        for (var corequisiteId : corequisiteIds) {
            studyPlan.getCourseCorequisites().add(
                    new CourseCorequisite(
                            AggregateReference.to(courseId),
                            AggregateReference.to(corequisiteId)
                    )
            );
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto unlinkCorequisitesFromCourse(
            long studyPlanId,
            long courseId,
            long corequisiteId
    ) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        boolean removed = studyPlan.getCourseCorequisites().removeIf(courseCorequisite ->
                courseCorequisite.getCourse().getId() == courseId && courseCorequisite.getCorequisite().getId() == corequisiteId
        );

        if (!removed) throw new CourseNotFoundException("Corequisite not found");

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto unlinkPrerequisitesFromCourse(
            long studyPlanId,
            long courseId,
            long prerequisiteId
    ) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        boolean removed = studyPlan.getCoursePrerequisites().removeIf(coursePrerequisite ->
                coursePrerequisite.getCourse().getId() == courseId
                        && coursePrerequisite.getPrerequisite().getId() == prerequisiteId
        );

        if (!removed) throw new CourseNotFoundException("Prerequisite not found");

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto moveCourseToSection(
            long studyPlanId,
            List<Long> courseIds,
            long targetSectionId
    ) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        var targetSection = studyPlan.getSections().stream()
                .filter(section -> section.getId() == targetSectionId)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Target section not found"));

        for (long courseId : courseIds) {
            studyPlan.getSections().forEach(section -> section.removeCourse(courseId));

            if (targetSection.getType() == SectionType.Elective || targetSection.getType() == SectionType.Remedial) {
                studyPlan.getCoursePlacements().remove(courseId);
            }

            targetSection.addCourse(courseId);
        }

        return studyPlanService.saveAndMap(studyPlan);
    }
}
