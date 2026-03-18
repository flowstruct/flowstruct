package com.flowstruct.api.sitegenerator.exception;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class GenerationNotCompletedException extends RuntimeException {
    public GenerationNotCompletedException(long id, GenerationStatus status) {
        super("Site generation " + id + " is not completed. Current status: " + status);
    }
}