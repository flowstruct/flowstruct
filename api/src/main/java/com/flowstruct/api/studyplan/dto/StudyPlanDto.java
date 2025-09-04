package com.flowstruct.api.studyplan.dto;

import com.flowstruct.api.studyplan.domain.Relation;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

public record StudyPlanDto(
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
        Long updatedBy,
        List<SectionDto> sections,
        Map<Long, PlacementDto> coursePlacements,
        Map<Long, Map<Long, Relation>> coursePrerequisites,
        Map<Long, Set<Long>> courseCorequisites
) {
}
