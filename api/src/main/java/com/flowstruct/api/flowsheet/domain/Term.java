package com.flowstruct.api.flowsheet.domain;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("term")
public class Term {

  @Id
  private Long id;

  private int position;

  private int year;

  private String name;

  @MappedCollection(idColumn = "term")
  private Set<Placement> placements = new HashSet<>();

  public Term(Term other) {
    this.id = other.id;
    this.position = other.position;
    this.year = other.year;
    this.placements = other.placements;
  }
}
