package com.flowstruct.api.studyplan.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record PlacementDto(

        @Min(value = 1, message = "A course cannot be placed in a year less than 1.")
        int year,

        @Min(value = 1, message = "Cannot place course before first semester.")
        @Max(value = 3, message = "Cannot place course after summer semester.")
        int semester,

        @Min(value = 1, message = "Course cannot be placed in a position less than 1.")
        int position,

        @Min(value = 1, message = "Course must span at least 1 course.")
        @Max(value = 5, message = "Course cannot span more than 5 courses.")
        int span
) {
}
