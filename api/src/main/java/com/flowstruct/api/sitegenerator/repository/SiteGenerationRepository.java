package com.flowstruct.api.sitegenerator.repository;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteGenerationRepository extends CrudRepository<SiteGeneration, Long> {

  List<SiteGeneration> findAllByOrderByCreatedAtDesc();

  Optional<SiteGeneration> findFirstByStatusInOrderByCreatedAtDesc(List<GenerationStatus> statuses);

  boolean existsByStatusIn(List<GenerationStatus> statuses);
}
