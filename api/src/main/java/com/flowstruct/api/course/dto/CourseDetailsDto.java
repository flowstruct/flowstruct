package com.flowstruct.api.course.dto;

import com.flowstruct.api.course.domain.CourseType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseDetailsDto(
        @NotBlank(message = "Course must have a unique code.")
        String code,

        @NotBlank(message = "Course must have a name.")
        String name,

        @Min(value = 0, message = "Course cannot have less than 0 credit hours.")
        int creditHours,

        @NotNull(message = "A course must provide a valid ECTS number.")
        @Min(value = 0, message = "Course cannot have less than 0 ECTS.")
        int ects,

        @Min(value = 0, message = "Course cannot have less than 0 lecture hours.")
        int lectureHours,

        @Min(value = 0, message = "Course cannot have less than 0 practical hours.")
        int practicalHours,

        CourseType type,

        boolean isRemedial
) {
}
