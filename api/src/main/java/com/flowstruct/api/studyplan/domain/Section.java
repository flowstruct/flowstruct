package com.flowstruct.api.studyplan.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("section")
public class Section {

    @Id
    private Long id;

    private SectionLevel level;

    private SectionType type;

    private int requiredCreditHours;

    private String name;

    private int position;

    @MappedCollection(idColumn = "section")
    Set<SectionCourse> courses = new HashSet<>();

    public Section(Section other) {
        this.id = other.id;
        this.level = other.level;
        this.type = other.type;
        this.requiredCreditHours = other.requiredCreditHours;
        this.name = other.name;
        this.position = other.position;

        this.courses = other.courses.stream()
                .map(SectionCourse::new)
                .collect(Collectors.toSet());
    }

    public boolean hasCourse(Long courseId) {
        return courses.contains(new SectionCourse(AggregateReference.to(courseId)));
    }

    public void addCourse(Long courseId) {
        courses.add(new SectionCourse(AggregateReference.to(courseId)));
    }

    public void removeCourse(Long courseId) {
        courses.remove(new SectionCourse(AggregateReference.to(courseId)));
    }
}
