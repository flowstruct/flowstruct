package com.flowstruct.api.course.service;

import com.flowstruct.api.common.CodeFormatter;
import com.flowstruct.api.course.domain.Course;
import com.flowstruct.api.course.dto.CourseDetailsDto;
import com.flowstruct.api.course.dto.CourseDto;
import com.flowstruct.api.course.repository.CourseRepository;
import com.flowstruct.api.studyplan.exception.CourseExistsException;
import com.flowstruct.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class CourseManagerService {
    private final CourseService courseService;
    private final CourseRepository courseRepository;
    private final CodeFormatter codeFormatter;
    private final UserService userService;

    @Transactional
    public CourseDto editCourseDetails(long courseId, CourseDetailsDto details) {
        var course = courseService.findOrThrow(courseId);

        String courseCode = codeFormatter.apply(course.getCode());
        String userEnteredCode = codeFormatter.apply(details.code());

        if (courseRepository.existsByCodeIgnoreCase(userEnteredCode) && !courseCode.equalsIgnoreCase(userEnteredCode)) {
            throw new CourseExistsException("Course with code " + details.code() + " already exists.");
        }

        course.setCode(userEnteredCode);
        course.setName(details.name().trim());
        course.setCreditHours(details.creditHours());
        course.setEcts(details.ects());
        course.setLectureHours(details.lectureHours());
        course.setPracticalHours(details.practicalHours());
        course.setType(details.type());
        course.setRemedial(details.isRemedial());

        return courseService.saveAndMap(course);
    }

    @Transactional
    public CourseDto createCourse(CourseDetailsDto details) {
        String userEnteredCode = codeFormatter.apply(details.code());

        if (courseRepository.existsByCodeIgnoreCase(userEnteredCode)) {
            throw new CourseExistsException("Course with code " + userEnteredCode + " already exists.");
        }

        var newCourse = new Course(
                null,
                userEnteredCode,
                details.name().trim(),
                details.creditHours(),
                details.ects(),
                details.lectureHours(),
                details.practicalHours(),
                details.type(),
                details.isRemedial(),
                null,
                null,
                null,
                null,
                null,
                null
        );

        return courseService.saveAndMap(newCourse);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public CourseDto markCourseOutdated(long courseId) {
        var course = courseService.findOrThrow(courseId);
        var currentUser = userService.getCurrentUser();

        course.setOutdatedAt(Instant.now());
        course.setOutdatedBy(currentUser.getId());

        return courseService.saveAndMap(course);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public CourseDto markCourseActive(long courseId) {
        var course = courseService.findOrThrow(courseId);

        course.setOutdatedAt(null);
        course.setOutdatedBy(null);

        return courseService.saveAndMap(course);
    }
}
