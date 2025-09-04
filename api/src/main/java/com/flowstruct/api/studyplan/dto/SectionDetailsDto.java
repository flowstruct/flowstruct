package com.flowstruct.api.studyplan.dto;

import com.flowstruct.api.studyplan.domain.SectionLevel;
import com.flowstruct.api.studyplan.domain.SectionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SectionDetailsDto(
        SectionLevel level,

        SectionType type,

        @Min(value = 0, message = "Section cannot have less than 0 required credit hours.")
        int requiredCreditHours,

        @NotNull(message = "Name cannot be undefined.")
        String name
) {
}
