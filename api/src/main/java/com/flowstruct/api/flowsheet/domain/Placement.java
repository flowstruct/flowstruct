package com.flowstruct.api.flowsheet.domain;

import com.flowstruct.api.course.domain.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.data.relational.core.mapping.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("placement")
public class Placement {

    private AggregateReference<Course, Long> course;

    private int term;

    private int position;

    private int span;

    public Placement(Placement other) {
        this.course = other.course;
        this.term = other.term;
        this.position = other.position;
        this.span = other.span;
    }
}
