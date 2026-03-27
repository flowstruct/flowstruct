package com.flowstruct.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(SiteGeneratorProperties.CONFIG_PREFIX)
public class SiteGeneratorProperties {

  public static final String CONFIG_PREFIX = "site-generator";

  public static final String DEFAULT_DIR = "content";

  public static final String DEFAULT_SCRIPT = "npm run build";

  public static final String DEFAULT_ICON_PATH = "/app/content/src/assets/logo.png";

  private String dir = DEFAULT_DIR;

  private String script = DEFAULT_SCRIPT;

  private String iconPath = DEFAULT_ICON_PATH;

  private String apiKey;
}
