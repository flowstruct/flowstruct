package com.flowstruct.api.studyplan.dto;

import java.time.Instant;

public record StudyPlanSummaryDto(
        long id,
        int year,
        int duration,
        String track,
        long program,
        String status,
        Instant archivedAt,
        Long archivedBy,
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy
) {
}
