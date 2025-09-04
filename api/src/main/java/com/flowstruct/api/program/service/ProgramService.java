package com.flowstruct.api.program.service;

import com.flowstruct.api.program.domain.Program;
import com.flowstruct.api.program.dto.ProgramDto;
import com.flowstruct.api.program.exception.ProgramNotFoundException;
import com.flowstruct.api.program.mapper.ProgramDtoMapper;
import com.flowstruct.api.program.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProgramService {
    private final ProgramRepository programRepository;
    private final ProgramDtoMapper programDtoMapper;

    public List<ProgramDto> getAllPrograms() {
        return programRepository.findAll()
                .stream()
                .map(programDtoMapper)
                .toList();
    }

    public ProgramDto getProgram(long programId) {
        var program = findOrThrow(programId);
        return programDtoMapper.apply(program);
    }

    public Program findOrThrow(long programId) {
        return programRepository.findById(programId)
                .orElseThrow(
                        () -> new ProgramNotFoundException("Program with was not found.")
                );
    }

    public ProgramDto saveAndMap(Program program) {
        var savedProgram = programRepository.save(program);
        return programDtoMapper.apply(savedProgram);
    }
}
