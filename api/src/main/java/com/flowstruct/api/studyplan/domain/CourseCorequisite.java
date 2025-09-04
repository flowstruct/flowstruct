package com.flowstruct.api.studyplan.domain;

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
@Table("course_corequisite")
public class CourseCorequisite {

    private AggregateReference<Course, Long> course;

    private AggregateReference<Course, Long> corequisite;

    public CourseCorequisite(CourseCorequisite other) {
        if (other.course != null) {
            this.course = AggregateReference.to(other.course.getId());
        }
        if (other.corequisite != null) {
            this.corequisite = AggregateReference.to(other.corequisite.getId());
        }
    }

}
