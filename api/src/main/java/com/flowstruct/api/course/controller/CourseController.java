package com.flowstruct.api.course.controller;

import com.flowstruct.api.course.domain.OutdatedFilter;
import com.flowstruct.api.course.dto.CourseDetailsDto;
import com.flowstruct.api.course.dto.CourseDto;
import com.flowstruct.api.course.dto.CoursesPageDto;
import com.flowstruct.api.course.service.CourseManagerService;
import com.flowstruct.api.course.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/courses")
@RestController
public class CourseController {
    private final CourseService courseService;
    private final CourseManagerService courseManagerService;

    @GetMapping
    public ResponseEntity<CoursesPageDto> getPaginatedCourseList(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "filter", defaultValue = "", required = false) String filter,
            @RequestParam(value = "status", defaultValue = "all", required = false) OutdatedFilter status
    ) {
        return new ResponseEntity<>(
                courseService.getPaginatedCourseList(page, size, filter, status),
                HttpStatus.OK
        );
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDto> getCourse(@PathVariable long courseId) {
        return new ResponseEntity<>(
                courseService.getCourse(courseId),
                HttpStatus.OK
        );
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<CourseDto> editCourseDetails(
            @PathVariable long courseId,
            @Valid @RequestBody CourseDetailsDto courseDetails
    ) {
        return new ResponseEntity<>(
                courseManagerService.editCourseDetails(courseId, courseDetails),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<CourseDto> createCourse(
            @Valid @RequestBody CourseDetailsDto courseDetails
    ) {
        return new ResponseEntity<>(
                courseManagerService.createCourse(courseDetails),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{courseId}/mark-outdated")
    public ResponseEntity<CourseDto> markCourseOutdated(@PathVariable long courseId) {
        return new ResponseEntity<>(
                courseManagerService.markCourseOutdated(courseId),
                HttpStatus.OK
        );
    }

    @PutMapping("/{courseId}/mark-active")
    public ResponseEntity<CourseDto> markCourseActive(@PathVariable long courseId) {
        return new ResponseEntity<>(
                courseManagerService.markCourseActive(courseId),
                HttpStatus.OK
        );
    }
}
