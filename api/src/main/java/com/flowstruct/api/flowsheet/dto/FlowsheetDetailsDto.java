package com.flowstruct.api.flowsheet.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FlowsheetDetailsDto(
        @Min(value = 2005, message = "Study plan must start at a year greater than 2004.")
        int year,

        @NotNull(message = "Name cannot be undefined.")
        String name,

        @NotNull(message = "Study plan must belong to a program.")
        long program
) {
}
