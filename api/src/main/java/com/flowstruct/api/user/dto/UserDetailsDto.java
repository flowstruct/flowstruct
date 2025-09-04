package com.flowstruct.api.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDetailsDto(

        @NotBlank(message = "Please provide a username.")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters long.")
        String username,

        @NotBlank(message = "Please provide an email address.")
        @Email(message = "Please provide a valid email address.")
        String email
) {
}
