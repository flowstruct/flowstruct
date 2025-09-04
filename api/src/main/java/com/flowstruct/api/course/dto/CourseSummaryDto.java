package com.flowstruct.api.course.dto;

import java.time.Instant;

public record CourseSummaryDto(
        long id,
        String code,
        String name,
        int creditHours,
        String type,
        boolean isRemedial,
        Instant outdatedAt,
        Long outdatedBy,
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy
) {
}
