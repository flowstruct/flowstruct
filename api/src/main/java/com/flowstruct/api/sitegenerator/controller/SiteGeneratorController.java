package com.flowstruct.api.sitegenerator.controller;

import com.flowstruct.api.sitegenerator.dto.SiteGenerationDto;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationSettingsDto;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationSummaryDto;
import com.flowstruct.api.sitegenerator.service.SiteGenerationService;
import com.flowstruct.api.sitegenerator.service.SiteGenerationSettingsService;
import com.flowstruct.api.sitegenerator.service.SiteGeneratorManagerService;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/site-generations")
@RequiredArgsConstructor
public class SiteGeneratorController {

  private final SiteGenerationService siteGenerationService;

  private final SiteGeneratorManagerService siteGeneratorManagerService;

  private final SiteGenerationSettingsService settingsService;

  @PostMapping
  public ResponseEntity<SiteGenerationDto> triggerGeneration() {
    return new ResponseEntity<>(
        siteGeneratorManagerService.triggerGeneration(), HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<SiteGenerationSummaryDto>> getAllGenerations() {
    return new ResponseEntity<>(siteGenerationService.getAllGenerations(), HttpStatus.OK);
  }

  @GetMapping("/current")
  public ResponseEntity<SiteGenerationSummaryDto> getCurrentGeneration() {
    return siteGenerationService
        .getCurrentGeneration()
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.noContent().build());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SiteGenerationDto> getGeneration(@PathVariable long id) {
    return new ResponseEntity<>(siteGenerationService.getGeneration(id), HttpStatus.OK);
  }

  @GetMapping("/{id}/download")
  public ResponseEntity<Resource> downloadAssets(@PathVariable long id) {
    Resource resource = siteGenerationService.getGenerationAssets(id);
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"site-generation-" + id + ".zip\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(resource);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteGeneration(@PathVariable long id) {
    siteGeneratorManagerService.deleteGeneration(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/retry")
  public ResponseEntity<SiteGenerationDto> retryGeneration(@PathVariable long id) {
    return new ResponseEntity<>(
        siteGeneratorManagerService.retryGeneration(id), HttpStatus.CREATED);
  }

  @GetMapping("/settings")
  public ResponseEntity<SiteGenerationSettingsDto> getSettings() {
    var settings = settingsService.get();
    return ResponseEntity.ok(new SiteGenerationSettingsDto(settings.title()));
  }

  @PutMapping("/settings/title")
  public ResponseEntity<Void> updateTitle(@RequestBody String title) {
    settingsService.updateTitle(title);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/settings/icon")
  public ResponseEntity<Void> uploadIcon(@RequestParam("file") MultipartFile file)
      throws IOException {
    settingsService.updateIcon(file);
    return ResponseEntity.noContent().build();
  }
}
