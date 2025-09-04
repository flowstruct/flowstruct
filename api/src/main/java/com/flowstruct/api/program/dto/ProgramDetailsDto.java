package com.flowstruct.api.program.dto;

import com.flowstruct.api.program.domain.Degree;
import jakarta.validation.constraints.NotBlank;

public record ProgramDetailsDto(

        @NotBlank(message = "Program must have a unique code.")
        String code,

        @NotBlank(message = "Program must have a name.")
        String name,

        Degree degree
) {
}
