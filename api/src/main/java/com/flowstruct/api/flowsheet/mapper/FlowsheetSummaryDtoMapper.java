package com.flowstruct.api.flowsheet.mapper;

import com.flowstruct.api.flowsheet.dto.FlowsheetSummaryDto;
import com.flowstruct.api.flowsheet.projection.FlowsheetSummaryProjection;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.function.Function;

@Service
public class FlowsheetSummaryDtoMapper implements Function<FlowsheetSummaryProjection, FlowsheetSummaryDto> {

    @Override
    public FlowsheetSummaryDto apply(FlowsheetSummaryProjection flowsheet) {
        String status = flowsheet.approvedVersion() == null
                ? "NEW"
                : !Objects.equals(flowsheet.approvedVersion(), flowsheet.version())
                ? "DRAFT"
                : "APPROVED";

        return new FlowsheetSummaryDto(
                flowsheet.id(),
                flowsheet.year(),
                flowsheet.name(),
                flowsheet.program(),
                status,
                flowsheet.archivedAt(),
                flowsheet.archivedBy(),
                flowsheet.createdAt(),
                flowsheet.updatedAt(),
                flowsheet.updatedBy()
        );
    }
}
