package com.flowstruct.api.studyplan.projection;

import java.time.Instant;

public record StudyPlanSummaryProjection(
        long id,
        int year,
        int duration,
        String track,
        Instant archivedAt,
        Long archivedBy,
        Long version,
        Long approvedVersion,
        int program,
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy
) {
}
