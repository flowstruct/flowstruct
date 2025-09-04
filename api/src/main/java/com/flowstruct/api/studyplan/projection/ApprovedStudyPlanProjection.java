package com.flowstruct.api.studyplan.projection;

import com.flowstruct.api.studyplan.domain.StudyPlanDraft;

public record ApprovedStudyPlanProjection(
        long id,
        StudyPlanDraft approvedStudyPlan
) {
}
