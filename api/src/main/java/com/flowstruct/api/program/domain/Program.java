package com.flowstruct.api.program.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.*;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("program")
public class Program {

    @Id
    private Long id;

    private String code;

    private String name;

    private Degree degree;

    private Instant outdatedAt;

    private Long outdatedBy;

    @Version
    private Long version;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @LastModifiedBy
    private Long updatedBy;
}
