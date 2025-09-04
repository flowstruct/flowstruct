package com.flowstruct.api.course.dto;

import java.util.List;

public record CoursesPageDto(
        List<CourseSummaryDto> content,
        int page,
        int size,
        long totalCourses,
        int totalPages,
        boolean isLastPage
) {
}
