package com.flowstruct.api.sitegenerator.dto;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import java.time.Instant;

public record SiteGenerationDto(
    long id,
    GenerationStatus status,
    Integer fileCount,
    Long sizeBytes,
    String errorMessage,
    Instant startedAt,
    Instant completedAt,
    Instant createdAt,
    Long createdBy) {}
