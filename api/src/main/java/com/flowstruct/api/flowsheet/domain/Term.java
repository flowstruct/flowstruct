package com.flowstruct.api.flowsheet.domain;

import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("term")
public class Term {

  @Id private Long id;

  private int termNumber;

  private String name;

  @MappedCollection(idColumn = "term")
  private Set<Placement> placements = new HashSet<>();

  public Term(Term other) {
    this.id = other.id;
    this.termNumber = other.termNumber;
    this.placements = other.placements;
  }
}
