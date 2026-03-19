package com.flowstruct.api.sitegenerator.service;

import com.flowstruct.api.sitegenerator.exception.BuildException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class AstroBuildService {

  private static final String DIST_DIR = "dist";

  @Value("${api.key}")
  private String apiKey;

  @Value("${site-generator.dir}")
  private String siteGeneratorDir;

  public BuildResult executeBuild() throws BuildException {
    Path contentPath = Paths.get(siteGeneratorDir);
    Path distPath = contentPath.resolve(DIST_DIR);

    try {
      ProcessBuilder processBuilder = new ProcessBuilder("pnpm", "build");
      processBuilder.directory(contentPath.toFile());
      processBuilder.environment().put("API_KEY", apiKey);
      processBuilder.redirectErrorStream(true);

      Process process = processBuilder.start();
      int exitCode = process.waitFor();

      if (exitCode != 0) {
        String output = new String(process.getInputStream().readAllBytes());
        throw new BuildException("Build failed with exit code " + exitCode + ": " + output);
      }

      if (!Files.exists(distPath)) {
        throw new BuildException("Dist directory not found after build");
      }

      return createZip(distPath);
    } catch (IOException | InterruptedException e) {
      if (e instanceof InterruptedException) {
        Thread.currentThread().interrupt();
      }
      throw new BuildException("Failed to execute build: " + e.getMessage(), e);
    }
  }

  private BuildResult createZip(Path path) throws BuildException {
    try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(baos)) {
      int[] fileCount = {0};
      long[] totalSize = {0};

      try (Stream<Path> paths = Files.walk(path)) {
        paths
            .filter(p -> !Files.isDirectory(p))
            .forEach(
                p -> {
                  try {
                    String entryName = path.relativize(p).toString().replace('\\', '/');
                    ZipEntry entry = new ZipEntry(entryName);

                    zos.putNextEntry(entry);
                    Files.copy(p, zos);
                    zos.closeEntry();

                    fileCount[0]++;
                    totalSize[0] += Files.size(p);
                  } catch (IOException e) {
                    throw new RuntimeException(e);
                  }
                });
      }
      zos.finish();

      byte[] zipBytes = baos.toByteArray();
      Resource resource = new ByteArrayResource(zipBytes);

      return new BuildResult(resource, fileCount[0], (long) zipBytes.length);
    } catch (IOException e) {
      throw new BuildException("Failed to create ZIP: " + e.getMessage(), e);
    }
  }

  public record BuildResult(Resource assets, int fileCount, long zipSize) {}
}
