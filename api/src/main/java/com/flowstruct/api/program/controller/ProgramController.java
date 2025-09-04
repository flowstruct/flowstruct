package com.flowstruct.api.program.controller;

import com.flowstruct.api.program.dto.ProgramDetailsDto;
import com.flowstruct.api.program.dto.ProgramDto;
import com.flowstruct.api.program.service.ProgramManagerService;
import com.flowstruct.api.program.service.ProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/programs")
public class ProgramController {
    private final ProgramService programService;
    private final ProgramManagerService programManagerService;

    @GetMapping
    public ResponseEntity<List<ProgramDto>> getAllPrograms() {
        return new ResponseEntity<>(programService.getAllPrograms(), HttpStatus.OK);
    }

    @GetMapping("/{programId}")
    public ResponseEntity<ProgramDto> getProgram(@PathVariable long programId) {
        return new ResponseEntity<>(programService.getProgram(programId), HttpStatus.OK);
    }

    @PutMapping("/{programId}")
    public ResponseEntity<ProgramDto> updateProgram(
            @PathVariable long programId,
            @Valid @RequestBody ProgramDetailsDto request
    ) {
        return new ResponseEntity<>(programManagerService.editProgramDetails(programId, request), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProgramDto> createProgram(@Valid @RequestBody ProgramDetailsDto programDetails) {
        return new ResponseEntity<>(programManagerService.createProgram(programDetails), HttpStatus.CREATED);
    }

    @PutMapping("/{programId}/mark-outdated")
    public ResponseEntity<ProgramDto> markProgramOutdated(@PathVariable long programId) {
        return new ResponseEntity<>(programManagerService.markProgramOutdated(programId), HttpStatus.OK);
    }

    @PutMapping("/{programId}/mark-active")
    public ResponseEntity<ProgramDto> unarchiveProgram(@PathVariable long programId) {
        return new ResponseEntity<>(programManagerService.markProgramActive(programId), HttpStatus.OK);
    }
}
