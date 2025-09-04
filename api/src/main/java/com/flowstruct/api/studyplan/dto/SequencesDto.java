package com.flowstruct.api.studyplan.dto;

import java.util.Set;

public record SequencesDto(
        Set<Long> prerequisiteSequence,
        Set<Long> postrequisiteSequence,
        int level
) {
}
