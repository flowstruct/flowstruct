package com.flowstruct.api.course.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor
@Getter
@Setter
public class CourseSequences {
        private Set<Long> prerequisiteSequence;
        private Set<Long> postrequisiteSequence;
        private int level;
}
