package com.flowstruct.api.program.dto;

import java.time.Instant;

public record ProgramDto(
        long id,
        String code,
        String name,
        String degree,
        Instant outdatedAt,
        Long outdatedBy,
        Instant createdAt,
        Instant updatedAt,
        Long updatedBy
) {
}
