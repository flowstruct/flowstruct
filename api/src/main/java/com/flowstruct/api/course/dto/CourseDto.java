package com.flowstruct.api.course.dto;

import com.flowstruct.api.course.domain.CourseType;

import java.time.Instant;

public record CourseDto(
        long id,
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
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy
) {
}
