package com.flowstruct.api.flowsheet.dto;

import java.time.Instant;

public record FlowsheetSummaryDto(
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
