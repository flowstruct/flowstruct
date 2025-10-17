package com.flowstruct.api.flowsheet.dto;

public record CoursePrerequisiteDto(
        long course,
        long prerequisite
) {
}
