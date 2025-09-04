package com.flowstruct.api.user.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDetailsDto(
        @NotBlank(message = "Username required.")
        String username,

        @NotBlank(message = "Password required.")
        String password
) {
}
