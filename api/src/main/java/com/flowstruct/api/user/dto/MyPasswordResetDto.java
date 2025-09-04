package com.flowstruct.api.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MyPasswordResetDto(

        @NotBlank(message = "Please provide the current password.")
        String currentPassword,

        @NotBlank(message = "Please provide the new password.")
        @Size(min = 8, message = "Password must be at least 8 characters long.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
        )
        String newPassword,

        @NotBlank(message = "Please confirm your new password.")
        String confirmPassword
) {
}
