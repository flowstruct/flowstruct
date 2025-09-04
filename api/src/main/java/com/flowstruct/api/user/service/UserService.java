package com.flowstruct.api.user.service;

import com.flowstruct.api.auth.service.JwtService;
import com.flowstruct.api.user.domain.User;
import com.flowstruct.api.user.dto.LoginDetailsDto;
import com.flowstruct.api.user.dto.UserDto;
import com.flowstruct.api.user.exception.InvalidCredentialsException;
import com.flowstruct.api.user.exception.UserNotFoundException;
import com.flowstruct.api.user.mapper.UserDtoMapper;
import com.flowstruct.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserDtoMapper userDtoMapper;

    public String verify(LoginDetailsDto details) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(details.username(), details.password())
            );
            
            return jwtService.generateToken(authentication.getName());
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Wrong username or password.");
        }
    }

    public UserDto getUserByUsername(String username) {
        var user = userRepository.findByUsername(username).orElseThrow(() ->
                new UserNotFoundException("User not found."));

        return userDtoMapper.apply(user);
    }

    public UserDto getUser(long userId) {
        var user = findOrThrow(userId);

        return userDtoMapper.apply(user);
    }

    public Map<Long, UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userDtoMapper)
                .collect(Collectors.toMap(
                        UserDto::id,
                        userDto -> userDto
                ));
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user was found."));
    }

    public User findOrThrow(long userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new UserNotFoundException("User not found."));
    }

    public UserDto saveAndMap(User user) {
        var savedUser = userRepository.save(user);
        return userDtoMapper.apply(savedUser);
    }
}
