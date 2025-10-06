package com.flowstruct.api.flowsheet.dto;

import com.flowstruct.api.flowsheet.domain.SectionLevel;
import com.flowstruct.api.flowsheet.domain.SectionType;

import java.util.List;

public record SectionDto(
        long id,
        SectionLevel level,
        SectionType type,
        int requiredCreditHours,
        String name,
        int position,
        List<Long> courses
) {
}
