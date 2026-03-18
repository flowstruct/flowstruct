package com.flowstruct.api.sitegenerator.domain;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.relational.core.mapping.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table("site_generation")
public class SiteGeneration {

  @Id private Long id;

  private GenerationStatus status;

  private byte[] assets;

  private Integer fileCount;

  private Long sizeBytes;

  private String errorMessage;

  private Instant startedAt;

  private Instant completedAt;

  @Version private Long version;

  @CreatedDate private Instant createdAt;

  @CreatedBy private Long createdBy;
}
