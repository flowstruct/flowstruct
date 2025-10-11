package com.flowstruct.api.flowsheet.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record PlacementDto(
        Long course,

        @Min(value = 1, message = "A course cannot be placed in a term less than 1.")
        int term,

        @Min(value = 1, message = "Course cannot be placed in a position less than 1.")
        int position,

        @Min(value = 1, message = "Course must span at least 1 course.")
        @Max(value = 5, message = "Course cannot span more than 5 courses.")
        int span
) {
}
