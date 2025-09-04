package com.flowstruct.api.user.dto;

import com.flowstruct.api.user.domain.Role;
import jakarta.validation.constraints.*;

public record NewUserDetailsDto(

        @NotBlank(message = "Please provide a username.")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters long.")
        String username,

        @NotBlank(message = "Please provide an email address.")
        @Email(message = "Please provide a valid email address.")
        String email,

        @NotBlank(message = "Please provide the new password.")
        @Size(min = 8, message = "Password must be at least 8 characters long.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
        )
        String password,

        @NotBlank(message = "Please confirm your new password.")
        String confirmPassword,

        @NotNull(message = "User must have a role.")
        Role role
) {
}
