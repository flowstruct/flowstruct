package com.flowstruct.api.flowsheet.domain;

import com.flowstruct.api.program.domain.Program;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.*;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("flowsheet")
public class Flowsheet {

  @Id private Long id;

  private int year;

  private String name;

  private AggregateReference<Program, Long> program;

  private FlowsheetSnapshot approvedFlowsheet;

  private Instant archivedAt;

  private Long archivedBy;

  @Version private Long version;

  @CreatedDate private Instant createdAt;

  @LastModifiedDate private Instant updatedAt;

  @LastModifiedBy private Long updatedBy;

  @MappedCollection(idColumn = "flowsheet")
  private Set<Section> sections = new HashSet<>();

  @MappedCollection(idColumn = "flowsheet")
  private Set<Term> terms = new HashSet<>();

  @MappedCollection(idColumn = "flowsheet")
  private Set<CoursePrerequisite> coursePrerequisites = new HashSet<>();

  @MappedCollection(idColumn = "flowsheet")
  private Set<CourseCorequisite> courseCorequisites = new HashSet<>();

  public Map<Long, List<CoursePrerequisite>> getCoursePrerequisitesMap() {
    return coursePrerequisites.stream()
        .collect(
            Collectors.groupingBy(coursePrerequisite -> coursePrerequisite.getCourse().getId()));
  }

  public Map<Long, List<CourseCorequisite>> getCourseCorequisitesMap() {
    return courseCorequisites.stream()
        .collect(Collectors.groupingBy(courseCorequisite -> courseCorequisite.getCourse().getId()));
  }

  public Map<Long, Placement> getPlacementsByCourse() {
    return terms.stream()
        .flatMap(t -> t.getPlacements().stream())
        .collect(Collectors.toUnmodifiableMap(p -> p.getCourse().getId(), p -> p));
  }
}
