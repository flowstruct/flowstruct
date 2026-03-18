package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationDto;
import com.flowstruct.api.sitegenerator.exception.BuildAlreadyInProgressException;
import com.flowstruct.api.sitegenerator.exception.BuildException;
import com.flowstruct.api.sitegenerator.exception.GenerationNotFailedException;
import com.flowstruct.api.sitegenerator.exception.SiteGenerationNotFoundException;
import com.flowstruct.api.sitegenerator.mapper.SiteGenerationDtoMapper;
import com.flowstruct.api.sitegenerator.repository.SiteGenerationRepository;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;

@Slf4j
@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('EDITOR')")
public class SiteGeneratorManagerService {

  private final SiteGenerationRepository siteGenerationRepository;

  private final AstroBuildService astroBuildService;

  private final SiteGenerationDtoMapper siteGenerationDtoMapper;

  @Transactional
  public SiteGenerationDto triggerGeneration() {
    checkForRunningBuild();

    SiteGeneration generation = new SiteGeneration();
    generation.setStatus(GenerationStatus.PENDING);
    generation = siteGenerationRepository.save(generation);

    executeBuildAsync(generation.getId());

    return siteGenerationDtoMapper.apply(generation);
  }

@Transactional
    public void deleteGeneration(long id) {
        siteGenerationRepository.deleteById(id);
    }

    @Transactional
    public SiteGenerationDto retryGeneration(long id) {
        SiteGeneration generation = siteGenerationRepository.findById(id)
                .orElseThrow(() -> new SiteGenerationNotFoundException(id));

        if (generation.getStatus() != GenerationStatus.FAILED) {
            throw new GenerationNotFailedException(id, generation.getStatus());
        }

        checkForRunningBuild();

        SiteGeneration newGeneration = new SiteGeneration();
        newGeneration.setStatus(GenerationStatus.PENDING);
        newGeneration = siteGenerationRepository.save(newGeneration);

        executeBuildAsync(newGeneration.getId());

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

  @Async("siteGeneratorExecutor")
  @Transactional
  public void executeBuildAsync(long generationId) {
    SiteGeneration generation = siteGenerationRepository.findById(generationId).orElse(null);

    if (generation == null) {
      log.error("Site generation {} not found for async execution", generationId);
      return;
    }

    try {
      generation.setStatus(GenerationStatus.RUNNING);
      generation.setStartedAt(Instant.now());
      generation = siteGenerationRepository.save(generation);

      log.info("Starting site generation build for id {}", generationId);

      AstroBuildService.BuildResult result = astroBuildService.executeBuild();

      byte[] assets;
      try {
        assets = FileCopyUtils.copyToByteArray(result.assets().getInputStream());
      } catch (IOException e) {
        throw new BuildException("Failed to read build result: " + e.getMessage(), e);
      }

      generation.setStatus(GenerationStatus.COMPLETED);
      generation.setAssets(assets);
      generation.setFileCount(result.fileCount());
      generation.setSizeBytes(result.zipSize());
      generation.setCompletedAt(Instant.now());

      siteGenerationRepository.save(generation);

      log.info(
          "Site generation {} completed successfully. Files: {}, Size: {} bytes",
          generationId,
          result.fileCount(),
          result.zipSize());

    } catch (Exception e) {
      log.error("Site generation {} failed: {}", generationId, e.getMessage(), e);

      generation.setStatus(GenerationStatus.FAILED);
      generation.setErrorMessage(e.getMessage());
      generation.setCompletedAt(Instant.now());

      siteGenerationRepository.save(generation);
    }
  }
}

