package com.flowstruct.api.flowsheet.dto;

import com.flowstruct.api.flowsheet.domain.Relation;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

public record FlowsheetDto(
        long id,
        int year,
        String name,
        long program,
        String status,
        Instant archivedAt,
        Long archivedBy,
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy,
        List<SectionDto> sections,
        List<PlacementDto> placements,
        Map<Long, List<Long>> coursePrerequisites,
        Map<Long, List<Long>> courseCorequisites
) {
}
