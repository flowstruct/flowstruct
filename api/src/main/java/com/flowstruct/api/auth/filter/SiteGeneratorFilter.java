package com.flowstruct.api.auth.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class SiteGeneratorFilter extends OncePerRequestFilter {

  private String siteGeneratorApiKey;

  public SiteGeneratorFilter(String siteGeneratorApiKey) {
    this.siteGeneratorApiKey = siteGeneratorApiKey;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String headerApiKey = request.getHeader("X-Site-Generator-Api-Key");

    if (Objects.equals(headerApiKey, siteGeneratorApiKey)) {
      Authentication authentication =
          new UsernamePasswordAuthenticationToken(
              siteGeneratorApiKey, null, List.of(new SimpleGrantedAuthority("ROLE_GUEST")));
      SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    filterChain.doFilter(request, response);
  }
}
