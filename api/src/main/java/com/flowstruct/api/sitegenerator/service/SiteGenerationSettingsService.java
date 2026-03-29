package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.domain.SiteGenerationSettings;
import com.flowstruct.api.sitegenerator.repository.SiteGenerationSettingsRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;

public class SiteGenerationSettingsService {

  public static final String CUSTOM_ICON = "icon.png";

  public static final String DEFAULT_ICON = "default-icon.png";

  private SiteGenerationSettingsRepository siteGenerationSettingsRepository;

  private String iconsPath;

  private SiteGenerationSettings cached;

  public SiteGenerationSettingsService(
      SiteGenerationSettingsRepository siteGenerationSettingsRepository, String iconsPath) {
    this.siteGenerationSettingsRepository = siteGenerationSettingsRepository;
    this.iconsPath = iconsPath;
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

  @PreAuthorize("hasRole('ROLE_APPROVER')")
  public void updateTitle(String title) {
    cached = new SiteGenerationSettings(title);
    siteGenerationSettingsRepository.save(cached);
  }

  public byte[] getIconBytes() throws IOException {
    Path customIconPath = getCustomIconPath();
    if (Files.exists(customIconPath)) {
      return Files.readAllBytes(customIconPath);
    }
    return Files.readAllBytes(getDefaultIconPath());
  }

  public boolean iconUsesDefault() {
    return !Files.exists(getCustomIconPath());
  }

  @PreAuthorize("hasRole('ROLE_APPROVER')")
  public void updateIcon(MultipartFile file) throws IOException {
    Files.createDirectories(Path.of(iconsPath));
    Files.write(getCustomIconPath(), file.getBytes());
  }

  @PreAuthorize("hasRole('ROLE_APPROVER')")
  public void deleteIcon() throws IOException {
    Path customIconPath = getCustomIconPath();
    if (Files.exists(customIconPath)) {
      Files.delete(customIconPath);
    }
  }

  private Path getCustomIconPath() {
    return Path.of(iconsPath, CUSTOM_ICON);
  }

  private Path getDefaultIconPath() {
    return Path.of(iconsPath, DEFAULT_ICON);
  }
}
