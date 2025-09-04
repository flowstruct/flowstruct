package com.flowstruct.api.studyplan.domain;

import com.flowstruct.api.course.domain.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.data.relational.core.mapping.Table;

import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("section_course")
public class SectionCourse {

    private AggregateReference<Course, Long> course;

    public SectionCourse(SectionCourse other) {
        if (other.course != null) {
            this.course = AggregateReference.to(other.course.getId());
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SectionCourse that)) return false;
        Long thisId = this.course == null ? null : this.course.getId();
        Long thatId = that.course == null ? null : that.course.getId();
        return Objects.equals(thisId, thatId);
    }

    @Override
    public int hashCode() {
        Long id = course == null ? null : course.getId();
        return Objects.hash(id);
    }
}
