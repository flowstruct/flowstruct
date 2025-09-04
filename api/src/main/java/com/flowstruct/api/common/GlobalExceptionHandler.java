package com.flowstruct.api.common;

import com.flowstruct.api.common.dto.ErrorObject;
import com.flowstruct.api.common.exception.AlreadyApprovedException;
import com.flowstruct.api.common.exception.EmptyListException;
import com.flowstruct.api.common.exception.InvalidDetailsException;
import com.flowstruct.api.common.exception.PendingResourceException;
import com.flowstruct.api.program.exception.InvalidDegreeException;
import com.flowstruct.api.program.exception.ProgramNotFoundException;
import com.flowstruct.api.program.exception.UniqueProgramException;
import com.flowstruct.api.studyplan.exception.*;
import com.flowstruct.api.user.exception.InvalidCredentialsException;
import com.flowstruct.api.user.exception.InvalidPasswordException;
import com.flowstruct.api.user.exception.UserNotFoundException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProgramNotFoundException.class)
    public ResponseEntity<ErrorObject> handleException(
            ProgramNotFoundException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.NOT_FOUND.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorObject> handleException(
            UserNotFoundException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.NOT_FOUND.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(AlreadyApprovedException.class)
    public ResponseEntity<ErrorObject> handleException(
            AlreadyApprovedException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(ApprovalRequestException.class)
    public ResponseEntity<ErrorObject> handleException(
            ApprovalRequestException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(EmptyListException.class)
    public ResponseEntity<ErrorObject> handleException(
            EmptyListException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidPasswordException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(InvalidDetailsException.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidDetailsException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorObject> handleException(
            MethodArgumentNotValidException exception
    ) {
        var errorMessages = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        errorMessages,
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(CourseNotPlacedException.class)
    public ResponseEntity<ErrorObject> handleException(
            CourseNotPlacedException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.NOT_FOUND.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(InvalidDraftException.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidDraftException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(PendingResourceException.class)
    public ResponseEntity<ErrorObject> handleException(
            PendingResourceException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidSpanException.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidSpanException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidCredentialsException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(StudyPlanNotFoundException.class)
    public ResponseEntity<ErrorObject> handleException(
            StudyPlanNotFoundException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(HttpStatus.NOT_FOUND.value(), List.of(exception.getMessage()), new Date()),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(InvalidDegreeException.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidDegreeException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UniqueProgramException.class)
    public ResponseEntity<ErrorObject> handleException(
            UniqueProgramException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ErrorObject> handleException(
            OptimisticLockingFailureException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(CyclicDependencyException.class)
    public ResponseEntity<ErrorObject> handleException(
            CyclicDependencyException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidCoursePlacement.class)
    public ResponseEntity<ErrorObject> handleException(
            InvalidCoursePlacement exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(SectionNotFoundException.class)
    public ResponseEntity<ErrorObject> handleException(
            SectionNotFoundException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(CourseExistsException.class)
    public ResponseEntity<ErrorObject> handleException(
            CourseExistsException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.CONFLICT.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(NotEnoughSectionsException.class)
    public ResponseEntity<ErrorObject> handleException(
            NotEnoughSectionsException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(OutOfBoundsPositionException.class)
    public ResponseEntity<ErrorObject> handleException(
            OutOfBoundsPositionException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(CourseAlreadyAddedException.class)
    public ResponseEntity<ErrorObject> handleException(
            CourseAlreadyAddedException exception
    ) {
        return new ResponseEntity<>(
                new ErrorObject(
                        HttpStatus.BAD_REQUEST.value(),
                        List.of(exception.getMessage()),
                        new Date()
                ),
                HttpStatus.BAD_REQUEST
        );
    }
}
