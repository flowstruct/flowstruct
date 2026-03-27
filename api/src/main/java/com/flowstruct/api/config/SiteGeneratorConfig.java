package com.flowstruct.api.config;

import com.flowstruct.api.sitegenerator.repository.SiteGenerationSettingsRepository;
import com.flowstruct.api.sitegenerator.service.AstroBuildService;
import com.flowstruct.api.sitegenerator.service.SiteGenerationSettingsService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({SiteGeneratorProperties.class})
public class SiteGeneratorConfig {

  @Bean
  public SiteGenerationSettingsService siteGenerationSettingsService(
      SiteGeneratorProperties properties,
      SiteGenerationSettingsRepository siteGenerationSettingsRepository) {
    return new SiteGenerationSettingsService(
        siteGenerationSettingsRepository, properties.getIconPath());
  }

  @Bean
  public AstroBuildService astroBuildService(
      SiteGeneratorProperties properties, SiteGenerationSettingsService settingsService) {
    return new AstroBuildService(
        properties.getApiKey(), properties.getDir(), properties.getScript(), settingsService);
  }
}
