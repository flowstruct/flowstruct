package com.flowstruct.api.studyplan.mapper;

import com.flowstruct.api.studyplan.domain.Section;
import com.flowstruct.api.studyplan.domain.SectionLevel;
import com.flowstruct.api.studyplan.domain.SectionType;
import com.flowstruct.api.studyplan.domain.StudyPlan;
import com.flowstruct.api.studyplan.dto.PlacementDto;
import com.flowstruct.api.studyplan.dto.SectionDto;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StudyPlanDtoMapper implements Function<StudyPlan, StudyPlanDto> {

    @Override
    public StudyPlanDto apply(StudyPlan studyPlan) {

        String status = studyPlan.getApprovedStudyPlan() == null
                ? "NEW"
                : !Objects.equals(studyPlan.getApprovedStudyPlan().getVersion(), studyPlan.getVersion())
                ? "DRAFT"
                : "APPROVED";

        return new StudyPlanDto(
                studyPlan.getId(),
                studyPlan.getYear(),
                studyPlan.getDuration(),
                studyPlan.getTrack(),
                studyPlan.getProgram().getId(),
                status,
                studyPlan.getArchivedAt(),
                studyPlan.getArchivedBy(),
                studyPlan.getCreatedAt(),
                studyPlan.getUpdatedAt(),
                studyPlan.getUpdatedBy(),
                studyPlan.getSections()
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
                studyPlan.getCoursePlacements().entrySet()
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
                studyPlan.getCoursePrerequisitesMap().entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue().stream()
                                        .collect(Collectors.toMap(
                                                prerequisite -> prerequisite.getPrerequisite().getId(),
                                                prerequisite -> prerequisite.getRelation()
                                        ))
                        )),
                studyPlan.getCourseCorequisitesMap().entrySet()
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
