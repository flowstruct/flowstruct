package com.flowstruct.api.flowsheet.mapper;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.Section;
import com.flowstruct.api.flowsheet.domain.SectionLevel;
import com.flowstruct.api.flowsheet.domain.SectionType;
import com.flowstruct.api.flowsheet.dto.*;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Objects;
import java.util.function.Function;

@Service
public class FlowsheetDtoMapper implements Function<Flowsheet, FlowsheetDto> {

    @Override
    public FlowsheetDto apply(Flowsheet flowsheet) {

        String status = flowsheet.getApprovedFlowsheet() == null
                ? "NEW"
                : !Objects.equals(flowsheet.getApprovedFlowsheet().getVersion(), flowsheet.getVersion())
                ? "DRAFT"
                : "APPROVED";

        return new FlowsheetDto(
                flowsheet.getId(),
                flowsheet.getYear(),
                flowsheet.getName(),
                flowsheet.getProgram().getId(),
                status,
                flowsheet.getArchivedAt(),
                flowsheet.getArchivedBy(),
                flowsheet.getCreatedAt(),
                flowsheet.getUpdatedAt(),
                flowsheet.getUpdatedBy(),
                flowsheet.getSections()
                        .stream()
                        .sorted(Comparator.comparing(this::getSectionCode))
                        .map(sec -> new SectionDto(
                                sec.getId(),
                                sec.getLevel(),
                                sec.getType(),
                                sec.getRequiredCreditHours(),
                                sec.getName(),
                                sec.getPosition(),
                                sec.getCourses().stream()
                                        .map(sectionCourse -> sectionCourse.getCourse().getId())
                                        .toList()
                        ))
                        .toList(),
                flowsheet.getPlacements()
                        .stream()
                        .map(p -> new PlacementDto(
                                p.getCourse().getId(),
                                p.getTerm(),
                                p.getPosition(),
                                p.getSpan()
                        ))
                        .toList(),
                flowsheet.getCoursePrerequisites()
                        .stream()
                        .map(cp -> new CoursePrerequisiteDto(cp.getCourse().getId(), cp.getPrerequisite().getId()))
                        .toList(),
                flowsheet.getCourseCorequisites()
                        .stream()
                        .map(cc -> new CourseCorequisiteDto(cc.getCourse().getId(), cc.getCorequisite().getId()))
                        .toList()
        );
    }

    private String getSectionCode(Section section) {
        return getSectionLevelCode(section.getLevel())
                + "." + getSectionTypeCode(section.getType())
                + (section.getPosition() > 0 ? "." + section.getPosition() : "");
    }

    private String getSectionLevelCode(SectionLevel level) {
        return switch (level) {
            case SectionLevel.University -> "1";
            case SectionLevel.School -> "2";
            case SectionLevel.Program -> "3";
        };
    }

    private String getSectionTypeCode(SectionType type) {
        return switch (type) {
            case SectionType.Requirement -> "1";
            case SectionType.Elective -> "2";
            case SectionType.Remedial -> "3";
        };
    }
}
