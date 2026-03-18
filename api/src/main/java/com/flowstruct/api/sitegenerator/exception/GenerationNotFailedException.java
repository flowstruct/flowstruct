package com.flowstruct.api.sitegenerator.exception;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class GenerationNotFailedException extends RuntimeException {
    public GenerationNotFailedException(long id, GenerationStatus status) {
        super("Site generation " + id + " cannot be retried. Current status: " + status);
    }
}