package com.flowstruct.api.sitegenerator.domain;

public record SiteGenerationSettings(String title) {

  public static final String DEFAULT_TITLE = "Flowstruct";

  public static SiteGenerationSettings defaults() {
    return new SiteGenerationSettings(DEFAULT_TITLE);
  }
}

