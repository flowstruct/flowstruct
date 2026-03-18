package com.flowstruct.api.sitegenerator.dto;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import java.time.Instant;

public record SiteGenerationSummaryDto(
        long id,
        GenerationStatus status,
        Instant createdAt,
        Long createdBy,
        Instant startedAt,
        Instant completedAt
) {}