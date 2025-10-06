package com.flowstruct.api.flowsheet.exception;

public class FlowsheetNotFoundException extends RuntimeException {
    public FlowsheetNotFoundException(String message) {
        super(message);
    }
}
