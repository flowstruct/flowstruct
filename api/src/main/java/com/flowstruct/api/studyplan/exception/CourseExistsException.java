package com.flowstruct.api.studyplan.exception;

public class CourseExistsException extends RuntimeException {
    public CourseExistsException(String message) {
        super(message);
    }
}
