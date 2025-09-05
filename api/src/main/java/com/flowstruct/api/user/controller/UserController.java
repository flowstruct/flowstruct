package com.flowstruct.api.user.controller;

import com.flowstruct.api.auth.service.CookieService;
import com.flowstruct.api.user.domain.Role;
import com.flowstruct.api.user.dto.*;
import com.flowstruct.api.user.service.UserManagementService;
import com.flowstruct.api.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final CookieService cookieService;
    private final UserManagementService userManagementService;

    @PostMapping("/login")
    public ResponseEntity<Void> loginUser(
            @Valid @RequestBody LoginDetailsDto loginDetails,
            HttpServletResponse response
    ) {
        String jwtToken = userService.verify(loginDetails);
        cookieService.createAuthCookie(response, jwtToken);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletResponse response) {
        cookieService.clearAuthCookie(response);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Map<Long, UserDto>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @Valid @RequestBody NewUserDetailsDto details
    ) {
        return new ResponseEntity<>(
                userManagementService.createUser(details),
                HttpStatus.OK
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> editUserDetails(
            @PathVariable long userId,
            @Valid @RequestBody UserDetailsDto details
    ) {
        return new ResponseEntity<>(
                userManagementService.editUserDetails(userId, details),
                HttpStatus.OK
        );
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<Void> changeUserPassword(
            @PathVariable long userId,
            @Valid @RequestBody AdminPasswordResetDto passwordReset
    ) {
        userManagementService.changeUserPassword(userId, passwordReset);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<UserDto> changeUserRole(
            @PathVariable long userId,
            @RequestParam(value = "role", defaultValue = "GUEST") Role newRole
    ) {
        return new ResponseEntity<>(
                userManagementService.changeUserRole(userId, newRole),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable long userId
    ) {
        userManagementService.deleteUser(userId);
        
        return ResponseEntity.noContent().build();
    }
}
