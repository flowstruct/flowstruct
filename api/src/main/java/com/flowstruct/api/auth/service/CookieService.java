package com.flowstruct.api.auth.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {

    @Value("${secure}")
    private boolean cookieSecure;

    @Value("${jwt.cookie.expiry}")
    private int cookieExpiry;

    public void clearAuthCookie(HttpServletResponse response) {
        ResponseCookie emptyCookie = ResponseCookie.from("accessToken")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, emptyCookie.toString());
    }

    public void createAuthCookie(HttpServletResponse response, String jwtToken) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", jwtToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofSeconds(cookieExpiry))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
    }
}
