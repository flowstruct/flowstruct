package com.flowstruct.api.common.exception;

public class AlreadyApprovedException extends RuntimeException {
    public AlreadyApprovedException(String message) {
        super(message);
    }
}
