package com.flowstruct.api.user.service;

import com.flowstruct.api.user.domain.Role;
import com.flowstruct.api.user.domain.User;
import com.flowstruct.api.user.dto.AdminPasswordResetDto;
import com.flowstruct.api.user.dto.NewUserDetailsDto;
import com.flowstruct.api.user.dto.UserDetailsDto;
import com.flowstruct.api.user.dto.UserDto;
import com.flowstruct.api.user.exception.InvalidPasswordException;
import com.flowstruct.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
@Service
public class UserManagementService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto createUser(NewUserDetailsDto details) {
        String password = details.password().trim();
        String confirmPassword = details.confirmPassword().trim();

        if (!confirmPassword.equals(password)) {
            throw new InvalidPasswordException("New and confirmed passwords must be the same.");
        }

        var user = new User(
                null,
                details.username().trim(),
                details.email().trim(),
                details.role(),
                passwordEncoder.encode(details.password().trim()),
                null,
                null,
                null
        );

        return userService.saveAndMap(user);
    }

    @Transactional
    public UserDto editUserDetails(long userId, UserDetailsDto details) {
        var user = userService.findOrThrow(userId);

        user.setUsername(details.username().trim());
        user.setEmail(details.email().trim());

        return userService.saveAndMap(user);
    }

    @Transactional
    public void changeUserPassword(long userId, AdminPasswordResetDto passwordReset) {
        String newPassword = passwordReset.newPassword().trim();
        String confirmPassword = passwordReset.confirmPassword().trim();

        if (!confirmPassword.equals(newPassword)) {
            throw new InvalidPasswordException("New and confirmed passwords must be the same.");
        }

        var user = userService.findOrThrow(userId);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public UserDto changeUserRole(long userId, Role newRole) {
        var user = userService.findOrThrow(userId);

        user.setRole(newRole);

        return userService.saveAndMap(user);
    }

    @Transactional
    public void deleteUser(long userId) {
        userRepository.deleteById(userId);
    }
}
