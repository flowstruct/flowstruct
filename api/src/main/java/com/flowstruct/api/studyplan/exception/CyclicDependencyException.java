package com.flowstruct.api.studyplan.exception;

public class CyclicDependencyException extends RuntimeException {
    public CyclicDependencyException(String message) {
        super(message);
    }
}
