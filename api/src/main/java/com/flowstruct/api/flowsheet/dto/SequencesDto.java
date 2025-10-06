package com.flowstruct.api.flowsheet.dto;

import java.util.Set;

public record SequencesDto(
        Set<Long> prerequisiteSequence,
        Set<Long> postrequisiteSequence,
        int level
) {
}
