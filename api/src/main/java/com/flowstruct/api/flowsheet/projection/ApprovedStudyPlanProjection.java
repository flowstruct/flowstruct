package com.flowstruct.api.flowsheet.projection;

import com.flowstruct.api.flowsheet.domain.FlowsheetSnapshot;

public record ApprovedStudyPlanProjection(
        long id,
        FlowsheetSnapshot approvedStudyPlan
) {
}
