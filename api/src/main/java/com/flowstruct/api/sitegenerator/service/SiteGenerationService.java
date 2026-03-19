package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationDto;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationSummaryDto;
import com.flowstruct.api.sitegenerator.exception.GenerationNotCompletedException;
import com.flowstruct.api.sitegenerator.exception.SiteGenerationNotFoundException;
import com.flowstruct.api.sitegenerator.mapper.SiteGenerationDtoMapper;
import com.flowstruct.api.sitegenerator.mapper.SiteGenerationSummaryDtoMapper;
import com.flowstruct.api.sitegenerator.repository.SiteGenerationRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteGenerationService {

  private final SiteGenerationRepository siteGenerationRepository;
  private final SiteGenerationDtoMapper siteGenerationDtoMapper;
  private final SiteGenerationSummaryDtoMapper siteGenerationSummaryDtoMapper;

  public List<SiteGenerationSummaryDto> getAllGenerations() {
    return siteGenerationRepository.findAllByOrderByCreatedAtDesc().stream()
        .map(siteGenerationSummaryDtoMapper)
        .toList();
  }

  public SiteGenerationDto getGeneration(long id) {
    SiteGeneration generation =
        siteGenerationRepository
            .findById(id)
            .orElseThrow(() -> new SiteGenerationNotFoundException(id));
    return siteGenerationDtoMapper.apply(generation);
  }

  public Optional<SiteGenerationSummaryDto> getCurrentGeneration() {
    return siteGenerationRepository
        .findFirstByStatusInOrderByCreatedAtDesc(
            List.of(GenerationStatus.PENDING, GenerationStatus.RUNNING))
        .map(siteGenerationSummaryDtoMapper);
  }

  public Resource getGenerationAssets(long id) {
    SiteGeneration generation =
        siteGenerationRepository
            .findById(id)
            .orElseThrow(() -> new SiteGenerationNotFoundException(id));

    if (generation.getStatus() != GenerationStatus.COMPLETED) {
      throw new GenerationNotCompletedException(id, generation.getStatus());
    }

    return new ByteArrayResource(generation.getAssets());
  }
}

