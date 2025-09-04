package com.flowstruct.api.course.mapper;

import com.flowstruct.api.course.domain.Course;
import com.flowstruct.api.course.dto.CourseSummaryDto;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class CourseSummaryDtoMapper implements Function<Course, CourseSummaryDto> {

    @Override
    public CourseSummaryDto apply(Course course) {
        return new CourseSummaryDto(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getCreditHours(),
                course.getType().toString(),
                course.isRemedial(),
                course.getOutdatedAt(),
                course.getOutdatedBy(),
                course.getCreatedAt(),
                course.getUpdatedAt(),
                course.getUpdatedBy()
        );
    }
}
