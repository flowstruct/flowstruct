package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import com.flowstruct.api.sitegenerator.domain.SiteGenerationTriggeredEvent;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationDto;
import com.flowstruct.api.sitegenerator.exception.BuildAlreadyInProgressException;
import com.flowstruct.api.sitegenerator.exception.GenerationNotFailedException;
import com.flowstruct.api.sitegenerator.exception.SiteGenerationNotFoundException;
import com.flowstruct.api.sitegenerator.mapper.SiteGenerationDtoMapper;
import com.flowstruct.api.sitegenerator.repository.SiteGenerationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('EDITOR')")
public class SiteGeneratorManagerService {

  private final SiteGenerationRepository siteGenerationRepository;

  private final ApplicationEventPublisher eventPublisher;

  private final SiteGenerationDtoMapper siteGenerationDtoMapper;

  @Transactional
  public SiteGenerationDto triggerGeneration() {
    checkForRunningBuild();

    SiteGeneration generation = new SiteGeneration();
    generation.setStatus(GenerationStatus.PENDING);
    generation = siteGenerationRepository.save(generation);

    eventPublisher.publishEvent(new SiteGenerationTriggeredEvent(generation.getId()));

    return siteGenerationDtoMapper.apply(generation);
  }

  @Transactional
  public void deleteGeneration(long id) {
    siteGenerationRepository.deleteById(id);
  }

  @Transactional
  public SiteGenerationDto retryGeneration(long id) {
    SiteGeneration failedGeneration =
        siteGenerationRepository
            .findById(id)
            .orElseThrow(() -> new SiteGenerationNotFoundException(id));

    if (failedGeneration.getStatus() != GenerationStatus.FAILED) {
      throw new GenerationNotFailedException(id, failedGeneration.getStatus());
    }

    checkForRunningBuild();

    SiteGeneration newGeneration = new SiteGeneration();
    newGeneration.setStatus(GenerationStatus.PENDING);
    newGeneration = siteGenerationRepository.save(newGeneration);

    eventPublisher.publishEvent(new SiteGenerationTriggeredEvent(newGeneration.getId()));

    return siteGenerationDtoMapper.apply(newGeneration);
  }

  private void checkForRunningBuild() {
    siteGenerationRepository
        .findFirstByStatusInOrderByCreatedAtDesc(
            List.of(GenerationStatus.PENDING, GenerationStatus.RUNNING))
        .ifPresent(
            generation -> {
              throw new BuildAlreadyInProgressException(generation.getId());
            });
  }
}
