package com.flowstruct.api.config;

import com.flowstruct.api.auth.filter.SiteGeneratorFilter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({SiteGeneratorProperties.class})
public class SiteGeneratorFilterConfig {

  @Bean
  public SiteGeneratorFilter siteGeneratorFilter(SiteGeneratorProperties props) {
    return new SiteGeneratorFilter(props.getApiKey());
  }
}
