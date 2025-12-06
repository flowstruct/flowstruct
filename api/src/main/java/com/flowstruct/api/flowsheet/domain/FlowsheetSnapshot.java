package com.flowstruct.api.flowsheet.domain;

import com.flowstruct.api.program.domain.Program;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlowsheetSnapshot {
  private int year;
  private String name;
  private AggregateReference<Program, Long> program;
  private Set<Section> sections;
  private Set<Term> terms;
  private Set<CoursePrerequisite> coursePrerequisites;
  private Set<CourseCorequisite> courseCorequisites;
  private Long version;

  public FlowsheetSnapshot(Flowsheet flowsheet) {
    this.year = flowsheet.getYear();
    this.name = flowsheet.getName();
    this.program = flowsheet.getProgram();
    this.version = flowsheet.getVersion();

    this.sections = flowsheet.getSections().stream()
        .map(Section::new)
        .collect(Collectors.toSet());

    this.terms = new HashSet<>(flowsheet.getTerms());

    this.coursePrerequisites = flowsheet.getCoursePrerequisites().stream()
        .map(CoursePrerequisite::new)
        .collect(Collectors.toSet());

    this.courseCorequisites = flowsheet.getCourseCorequisites().stream()
        .map(CourseCorequisite::new)
        .collect(Collectors.toSet());
  }
}
