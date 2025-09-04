package com.flowstruct.api.user.controller;

import com.flowstruct.api.auth.service.CookieService;
import com.flowstruct.api.user.dto.MyPasswordResetDto;
import com.flowstruct.api.user.dto.UserDetailsDto;
import com.flowstruct.api.user.dto.UserDto;
import com.flowstruct.api.user.dto.UserWithTokenDto;
import com.flowstruct.api.user.service.MyService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/me")
public class MyController {
    private final MyService myService;
    private final CookieService cookieService;

    @GetMapping
    public ResponseEntity<UserDto> getMe() {
        return new ResponseEntity<>(myService.getMe(), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<UserDto> editMyDetails(
            @Valid @RequestBody UserDetailsDto details,
            HttpServletResponse response
    ) {
        UserWithTokenDto userWithToken = myService.editMyDetails(details);
        cookieService.createAuthCookie(response, userWithToken.token());

        return new ResponseEntity<>(
                userWithToken.user(),
                HttpStatus.OK
        );
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changeMyPassword(@Valid @RequestBody MyPasswordResetDto passwordDetails) {
        myService.changeMyPassword(passwordDetails);
        return ResponseEntity.noContent().build();
    }
}
