package com.flowstruct.api.studyplan.controller;

import com.flowstruct.api.course.dto.CourseDto;
import com.flowstruct.api.course.dto.CourseSummaryDto;
import com.flowstruct.api.studyplan.domain.Relation;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import com.flowstruct.api.studyplan.service.StudyPlanCourseManagerService;
import com.flowstruct.api.studyplan.service.StudyPlanCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/study-plans/{studyPlanId}/courses")
public class StudyPlanCourseController {
    private final StudyPlanCourseService studyPlanCourseService;
    private final StudyPlanCourseManagerService studyPlanCourseManagerService;

    @GetMapping
    public ResponseEntity<Map<Long, CourseSummaryDto>> getStudyPlanCourseList(@PathVariable long studyPlanId) {
        return new ResponseEntity<>(
                studyPlanCourseService.getStudyPlanCourseList(studyPlanId),
                HttpStatus.OK
        );
    }

    @GetMapping("/detailed")
    public ResponseEntity<Map<Long, CourseDto>> getStudyPlanDetailedCourseList(@PathVariable long studyPlanId) {
        return new ResponseEntity<>(
                studyPlanCourseService.getStudyPlanDetailedCourseList(studyPlanId),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<StudyPlanDto> addCoursesToStudyPlan(
            @PathVariable long studyPlanId,
            @RequestParam(value = "section") long sectionId,
            @RequestParam(value = "courses", defaultValue = "") List<Long> courseIds
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.addCoursesToStudyPlan(studyPlanId, sectionId, courseIds),
                HttpStatus.OK
        );
    }

    @DeleteMapping
    public ResponseEntity<StudyPlanDto> removeCoursesFromStudyPlan(
            @PathVariable long studyPlanId,
            @RequestParam(value = "courses", defaultValue = "") List<Long> courseIds
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.removeCoursesFromStudyPlan(studyPlanId, courseIds),
                HttpStatus.OK
        );
    }

    @PostMapping("/{courseId}/prerequisites")
    public ResponseEntity<StudyPlanDto> linkPrerequisitesToCourse(
            @PathVariable long studyPlanId,
            @PathVariable long courseId,
            @RequestParam(value = "prerequisites", defaultValue = "") List<Long> prerequisiteIds,
            @RequestParam(value = "relation", defaultValue = "AND") Relation relation
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.linkPrerequisitesToCourse(studyPlanId, courseId, prerequisiteIds, relation),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{courseId}/prerequisites/{prerequisiteId}")
    public ResponseEntity<StudyPlanDto> unlinkPrerequisitesFromCourse(
            @PathVariable long studyPlanId,
            @PathVariable long courseId,
            @PathVariable long prerequisiteId
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.unlinkPrerequisitesFromCourse(studyPlanId, courseId, prerequisiteId),
                HttpStatus.OK
        );
    }

    @PostMapping("/{courseId}/corequisites")
    public ResponseEntity<StudyPlanDto> linkCorequisitesToCourse(
            @PathVariable long studyPlanId,
            @PathVariable long courseId,
            @RequestParam(value = "courses", defaultValue = "") List<Long> corequisiteIds
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.linkCorequisitesToCourse(studyPlanId, courseId, corequisiteIds),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{courseId}/corequisites/{corequisiteId}")
    public ResponseEntity<StudyPlanDto> unlinkCorequisitesFromCourse(
            @PathVariable long studyPlanId,
            @PathVariable long courseId,
            @PathVariable long corequisiteId
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.unlinkCorequisitesFromCourse(studyPlanId, courseId, corequisiteId),
                HttpStatus.OK
        );
    }

    @PutMapping("/move")
    public ResponseEntity<StudyPlanDto> moveCourseToSection(
            @PathVariable long studyPlanId,
            @RequestParam(value = "courses", defaultValue = "") List<Long> courseIds,
            @RequestParam(value = "section") long sectionId
    ) {
        return new ResponseEntity<>(
                studyPlanCourseManagerService.moveCourseToSection(studyPlanId, courseIds, sectionId),
                HttpStatus.OK
        );
    }
}
