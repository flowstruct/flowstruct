package com.flowstruct.api.sitegenerator.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class BuildAlreadyInProgressException extends RuntimeException {
    public BuildAlreadyInProgressException(long id) {
        super("A site generation is already in progress (id: " + id + "). Please wait for it to complete.");
    }
}