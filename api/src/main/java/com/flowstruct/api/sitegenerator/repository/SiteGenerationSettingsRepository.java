package com.flowstruct.api.sitegenerator.repository;

import com.flowstruct.api.sitegenerator.domain.SiteGenerationSettings;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SiteGenerationSettingsRepository {

  private final JdbcClient jdbc;

  private static final String SELECT_SQL = "SELECT title FROM site_generation_settings";

  private static final String UPDATE_SQL = "UPDATE site_generation_settings SET title = :title";

  private static final String INSERT_SQL =
      "INSERT INTO site_generation_settings (title) VALUES (:title)";

  public Optional<SiteGenerationSettings> find() {
    return jdbc.sql(SELECT_SQL).query(SiteGenerationSettings.class).optional();
  }

  public void save(SiteGenerationSettings settings) {
    int updated = jdbc.sql(UPDATE_SQL).param("title", settings.title()).update();

    if (updated == 0) {
      jdbc.sql(INSERT_SQL).param("title", settings.title()).update();
    }
  }
}
