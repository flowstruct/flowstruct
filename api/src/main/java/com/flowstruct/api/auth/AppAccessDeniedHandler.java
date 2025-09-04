package com.flowstruct.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowstruct.api.common.dto.ErrorObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Component
public class AppAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper objectMapper;

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        ErrorObject error = new ErrorObject(
                HttpServletResponse.SC_FORBIDDEN,
                List.of("You don't have permission to perform this action."),
                new Date()
        );

        String json = objectMapper.writeValueAsString(error);
        response.getWriter().write(json);
    }
}
