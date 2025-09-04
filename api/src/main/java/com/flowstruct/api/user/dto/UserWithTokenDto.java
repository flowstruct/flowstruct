package com.flowstruct.api.user.dto;

public record UserWithTokenDto(
        UserDto user,
        String token
) {
}
