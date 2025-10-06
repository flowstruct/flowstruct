package com.flowstruct.api.flowsheet.mapper;

import com.flowstruct.api.flowsheet.domain.Section;
import com.flowstruct.api.flowsheet.domain.SectionLevel;
import com.flowstruct.api.flowsheet.domain.SectionType;
import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.dto.PlacementDto;
import com.flowstruct.api.flowsheet.dto.SectionDto;
import com.flowstruct.api.flowsheet.dto.StudyPlanDto;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StudyPlanDtoMapper implements Function<Flowsheet, StudyPlanDto> {

    @Override
    public StudyPlanDto apply(Flowsheet flowsheet) {

        String status = flowsheet.getApprovedFlowsheet() == null
                ? "NEW"
                : !Objects.equals(flowsheet.getApprovedFlowsheet().getVersion(), flowsheet.getVersion())
                ? "DRAFT"
                : "APPROVED";

        return new StudyPlanDto(
                flowsheet.getId(),
                flowsheet.getYear(),
                flowsheet.getDuration(),
                flowsheet.getTrack(),
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
                flowsheet.getCoursePlacements().entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> new PlacementDto(
                                        entry.getValue().getYear(),
                                        entry.getValue().getSemester(),
                                        entry.getValue().getPosition(),
                                        entry.getValue().getSpan()
                                )
                        )),
                flowsheet.getCoursePrerequisitesMap().entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue().stream()
                                        .collect(Collectors.toMap(
                                                prerequisite -> prerequisite.getPrerequisite().getId(),
                                                prerequisite -> prerequisite.getRelation()
                                        ))
                        )),
                flowsheet.getCourseCorequisitesMap().entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue().stream()
                                        .map(corequisite -> corequisite.getCorequisite().getId())
                                        .collect(Collectors.toSet())
                        ))
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
