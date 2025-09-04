package com.flowstruct.api.studyplan.exception;

public class CourseAlreadyAddedException extends RuntimeException {
    public CourseAlreadyAddedException(String message) {
        super(message);
    }
}
