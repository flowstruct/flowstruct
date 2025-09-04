package com.flowstruct.api.studyplan.mapper;

import com.flowstruct.api.studyplan.dto.StudyPlanSummaryDto;
import com.flowstruct.api.studyplan.projection.StudyPlanSummaryProjection;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.function.Function;

@Service
public class StudyPlanSummaryDtoMapper implements Function<StudyPlanSummaryProjection, StudyPlanSummaryDto> {

    @Override
    public StudyPlanSummaryDto apply(StudyPlanSummaryProjection studyPlan) {
        String status = studyPlan.approvedVersion() == null
                ? "NEW"
                : !Objects.equals(studyPlan.approvedVersion(), studyPlan.version())
                ? "DRAFT"
                : "APPROVED";

        return new StudyPlanSummaryDto(
                studyPlan.id(),
                studyPlan.year(),
                studyPlan.duration(),
                studyPlan.track(),
                studyPlan.program(),
                status,
                studyPlan.archivedAt(),
                studyPlan.archivedBy(),
                studyPlan.createdAt(),
                studyPlan.updatedAt(),
                studyPlan.updatedBy()
        );
    }
}
