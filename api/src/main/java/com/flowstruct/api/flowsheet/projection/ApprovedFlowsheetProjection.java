package com.flowstruct.api.flowsheet.projection;

import com.flowstruct.api.flowsheet.domain.FlowsheetSnapshot;

public record ApprovedFlowsheetProjection(
        long id,
        FlowsheetSnapshot approvedStudyPlan
) {
}
