package com.flowstruct.api.config;

import com.flowstruct.api.sitegenerator.service.AstroBuildService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({SiteGeneratorProperties.class})
public class AstroBuildConfig {

  @Bean
  public AstroBuildService astroBuildService(SiteGeneratorProperties props) {
    return new AstroBuildService(props.getApiKey(), props.getDir(), props.getScript());
  }
}
