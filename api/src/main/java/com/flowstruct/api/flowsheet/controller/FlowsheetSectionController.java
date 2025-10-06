package com.flowstruct.api.flowsheet.controller;

import com.flowstruct.api.flowsheet.domain.MoveDirection;
import com.flowstruct.api.flowsheet.dto.SectionDetailsDto;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.service.FlowsheetSectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/study-plans/{flowsheetId}/sections")
public class FlowsheetSectionController {
    private final FlowsheetSectionService flowsheetSectionService;

    @PostMapping
    public ResponseEntity<FlowsheetDto> createSection(
            @PathVariable long flowsheetId,
            @Valid @RequestBody SectionDetailsDto sectionDetails
    ) {
        return new ResponseEntity<>(
                flowsheetSectionService.createSection(flowsheetId, sectionDetails),
                HttpStatus.OK
        );
    }

    @PutMapping("/{sectionId}")
    public ResponseEntity<FlowsheetDto> editSectionDetails(
            @PathVariable long flowsheetId,
            @PathVariable long sectionId,
            @Valid @RequestBody SectionDetailsDto sectionDetails
    ) {
        return new ResponseEntity<>(
                flowsheetSectionService.editSectionDetails(flowsheetId, sectionId, sectionDetails),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{sectionId}")
    public ResponseEntity<FlowsheetDto> deleteSection(
            @PathVariable long flowsheetId,
            @PathVariable long sectionId
    ) {
        return new ResponseEntity<>(
                flowsheetSectionService.deleteSection(flowsheetId, sectionId),
                HttpStatus.OK
        );
    }

    @PutMapping("/{sectionId}/move")
    public ResponseEntity<FlowsheetDto> moveSection(
            @PathVariable long flowsheetId,
            @PathVariable long sectionId,
            @RequestParam(value = "direction", defaultValue = "") MoveDirection direction
    ) {
        return new ResponseEntity<>(
                flowsheetSectionService.moveSection(flowsheetId, sectionId, direction),
                HttpStatus.OK
        );
    }
}
