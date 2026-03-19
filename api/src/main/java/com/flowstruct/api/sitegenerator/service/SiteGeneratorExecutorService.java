package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.domain.GenerationStatus;
import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import com.flowstruct.api.sitegenerator.domain.SiteGenerationTriggeredEvent;
import com.flowstruct.api.sitegenerator.exception.BuildException;
import com.flowstruct.api.sitegenerator.repository.SiteGenerationRepository;
import java.io.IOException;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.FileCopyUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteGeneratorExecutorService {

  private final SiteGenerationRepository siteGenerationRepository;

  private final AstroBuildService astroBuildService;

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  @Async("siteGeneratorExecutor")
  public void onGenerationTriggered(SiteGenerationTriggeredEvent event) {
    SiteGeneration generation =
        siteGenerationRepository.findById(event.generationId()).orElse(null);

    if (generation == null) {
      log.error("Site generation {} not found for async execution", event.generationId());
      return;
    }

    try {
      generation.setStatus(GenerationStatus.RUNNING);
      generation.setStartedAt(Instant.now());
      generation = siteGenerationRepository.save(generation);

      log.info("Starting site generation build for id {}", generation.getId());

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
          generation.getId(),
          result.fileCount(),
          result.zipSize());

    } catch (Exception e) {
      log.error("Site generation {} failed: {}", generation.getId(), e.getMessage(), e);

      generation.setStatus(GenerationStatus.FAILED);
      generation.setErrorMessage(e.getMessage());
      generation.setCompletedAt(Instant.now());

      siteGenerationRepository.save(generation);
    }
  }
}
