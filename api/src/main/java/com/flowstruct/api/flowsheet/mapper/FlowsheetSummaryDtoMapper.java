package com.flowstruct.api.flowsheet.mapper;

import com.flowstruct.api.flowsheet.dto.FlowsheetSummaryDto;
import com.flowstruct.api.flowsheet.projection.FlowsheetSummaryProjection;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.function.Function;

@Service
public class FlowsheetSummaryDtoMapper implements Function<FlowsheetSummaryProjection, FlowsheetSummaryDto> {

    @Override
    public FlowsheetSummaryDto apply(FlowsheetSummaryProjection studyPlan) {
        String status = studyPlan.approvedVersion() == null
                ? "NEW"
                : !Objects.equals(studyPlan.approvedVersion(), studyPlan.version())
                ? "DRAFT"
                : "APPROVED";

        return new FlowsheetSummaryDto(
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
