package com.flowstruct.api.flowsheet.dto;

import jakarta.validation.constraints.NotNull;

public record ApprovalRequestDetailsDto(
        String message,

        @NotNull(message = "Must pick an approver to send the request to.")
        long approver
) {
}
