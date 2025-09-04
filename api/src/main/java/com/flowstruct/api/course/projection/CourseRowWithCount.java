package com.flowstruct.api.course.projection;

import com.flowstruct.api.course.domain.CourseType;

import java.time.Instant;

public record CourseRowWithCount(
        Long id,
        String code,
        String name,
        int creditHours,
        int ects,
        int lectureHours,
        int practicalHours,
        CourseType type,
        boolean isRemedial,
        Instant outdatedAt,
        Long outdatedBy,
        Long version,
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy,
        long totalCourses
) {
}
