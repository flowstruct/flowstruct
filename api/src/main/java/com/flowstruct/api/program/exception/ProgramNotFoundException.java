package com.flowstruct.api.program.exception;

public class ProgramNotFoundException extends RuntimeException {
    public ProgramNotFoundException(String message) {
        super(message);
    }
}
