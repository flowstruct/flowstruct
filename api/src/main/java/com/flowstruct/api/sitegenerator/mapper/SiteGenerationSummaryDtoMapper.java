package com.flowstruct.api.sitegenerator.mapper;

import com.flowstruct.api.sitegenerator.domain.SiteGeneration;
import com.flowstruct.api.sitegenerator.dto.SiteGenerationSummaryDto;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class SiteGenerationSummaryDtoMapper implements Function<SiteGeneration, SiteGenerationSummaryDto> {

    @Override
    public SiteGenerationSummaryDto apply(SiteGeneration generation) {
        return new SiteGenerationSummaryDto(
                generation.getId(),
                generation.getStatus(),
                generation.getCreatedAt(),
                generation.getCreatedBy(),
                generation.getStartedAt(),
                generation.getCompletedAt()
        );
    }
}