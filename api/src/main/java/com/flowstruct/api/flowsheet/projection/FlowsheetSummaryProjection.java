package com.flowstruct.api.flowsheet.projection;

import java.time.Instant;

public record FlowsheetSummaryProjection(
        long id,
        int year,
        String name,
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
