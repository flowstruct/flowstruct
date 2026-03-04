package com.flowstruct.api.flowsheet.dto;

import java.time.Instant;
import java.util.List;

public record FlowsheetDto(
    long id,
    int year,
    String name,
    long program,
    String status,
    Instant archivedAt,
    Long archivedBy,
    Instant createdAt,
    Instant updatedAt,
    Long updatedBy,
    List<SectionDto> sections,
    List<TermDto> terms,
    List<CoursePrerequisiteDto> coursePrerequisites,
    List<CourseCorequisiteDto> courseCorequisites) {}
