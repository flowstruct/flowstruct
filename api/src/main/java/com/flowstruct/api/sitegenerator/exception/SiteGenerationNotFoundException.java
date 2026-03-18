package com.flowstruct.api.sitegenerator.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SiteGenerationNotFoundException extends RuntimeException {
    public SiteGenerationNotFoundException(long id) {
        super("Site generation not found with id: " + id);
    }
}