package com.flowstruct.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowstruct.api.common.dto.ErrorObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AppAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");

    ErrorObject error =
        new ErrorObject(
            HttpServletResponse.SC_UNAUTHORIZED, List.of("Session expired."), new Date());

    String json = objectMapper.writeValueAsString(error);
    response.getWriter().write(json);
  }
}
