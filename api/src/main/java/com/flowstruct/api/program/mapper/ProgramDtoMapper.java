package com.flowstruct.api.program.mapper;

import com.flowstruct.api.program.domain.Program;
import com.flowstruct.api.program.dto.ProgramDto;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class ProgramDtoMapper implements Function<Program, ProgramDto> {

    @Override
    public ProgramDto apply(Program program) {
        return new ProgramDto(
                program.getId(),
                program.getCode(),
                program.getName(),
                program.getDegree().name(),
                program.getOutdatedAt(),
                program.getOutdatedBy(),
                program.getCreatedAt(),
                program.getUpdatedAt(),
                program.getUpdatedBy()
        );
    }
}
