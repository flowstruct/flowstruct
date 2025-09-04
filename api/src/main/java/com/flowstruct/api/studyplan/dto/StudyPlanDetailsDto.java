package com.flowstruct.api.studyplan.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StudyPlanDetailsDto(
        @Min(value = 2005, message = "Study plan must start at a year greater than 2004.")
        int year,

        @Min(value = 1, message = "Study plan must be at least 1 year in duration.")
        int duration,

        @NotNull(message = "Track cannot be undefined.")
        String track,

        @NotNull(message = "Study plan must belong to a program.")
        long program
) {
}
