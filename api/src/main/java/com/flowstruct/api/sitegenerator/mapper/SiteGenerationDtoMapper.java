package com.flowstruct.api.sitegenerator.mapper;

import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationDto;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class SiteGenerationDtoMapper implements Function<SiteGeneration, SiteGenerationDto> {

    @Override
    public SiteGenerationDto apply(SiteGeneration generation) {
        return new SiteGenerationDto(
                generation.getId(),
                generation.getStatus(),
                generation.getFileCount(),
                generation.getSizeBytes(),
                generation.getErrorMessage(),
                generation.getStartedAt(),
                generation.getCompletedAt(),
                generation.getCreatedAt(),
                generation.getCreatedBy()
        );
    }
}