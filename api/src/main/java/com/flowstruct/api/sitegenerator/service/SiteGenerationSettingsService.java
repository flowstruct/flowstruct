package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.domain.SiteGenerationSettings;
import com.flowstruct.api.sitegenerator.repository.SiteGenerationSettingsRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.web.multipart.MultipartFile;

public class SiteGenerationSettingsService {

  private SiteGenerationSettingsRepository siteGenerationSettingsRepository;

  private String siteGeneratorIconPath;

  private SiteGenerationSettings cached;

  public SiteGenerationSettingsService(
      SiteGenerationSettingsRepository siteGenerationSettingsRepository,
      String siteGeneratorIconPath) {
    this.siteGenerationSettingsRepository = siteGenerationSettingsRepository;
    this.siteGeneratorIconPath = siteGeneratorIconPath;
    init();
  }

  private void init() {
    this.cached =
        siteGenerationSettingsRepository
            .find()
            .orElseGet(
                () -> {
                  var defaults = SiteGenerationSettings.defaults();
                  siteGenerationSettingsRepository.save(defaults);
                  return defaults;
                });
  }

  public SiteGenerationSettings get() {
    return cached;
  }

  public void updateTitle(String title) {
    cached = new SiteGenerationSettings(title);
    siteGenerationSettingsRepository.save(cached);
  }

  public void updateIcon(MultipartFile file) throws IOException {
    Files.createDirectories(Path.of(siteGeneratorIconPath).getParent());
    Files.write(Path.of(siteGeneratorIconPath), file.getBytes());
  }
}
