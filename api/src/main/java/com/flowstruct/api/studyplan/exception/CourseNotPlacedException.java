package com.flowstruct.api.studyplan.exception;

public class CourseNotPlacedException extends RuntimeException {
    public CourseNotPlacedException(String message) {
        super(message);
    }
}
