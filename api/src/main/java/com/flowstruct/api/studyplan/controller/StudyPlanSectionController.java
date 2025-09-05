package com.flowstruct.api.studyplan.controller;

import com.flowstruct.api.studyplan.domain.MoveDirection;
import com.flowstruct.api.studyplan.dto.SectionDetailsDto;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import com.flowstruct.api.studyplan.service.StudyPlanSectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/study-plans/{studyPlanId}/sections")
public class StudyPlanSectionController {
    private final StudyPlanSectionService studyPlanSectionService;

    @PostMapping
    public ResponseEntity<StudyPlanDto> createSection(
            @PathVariable long studyPlanId,
            @Valid @RequestBody SectionDetailsDto sectionDetails
    ) {
        return new ResponseEntity<>(
                studyPlanSectionService.createSection(studyPlanId, sectionDetails),
                HttpStatus.OK
        );
    }

    @PutMapping("/{sectionId}")
    public ResponseEntity<StudyPlanDto> editSectionDetails(
            @PathVariable long studyPlanId,
            @PathVariable long sectionId,
            @Valid @RequestBody SectionDetailsDto sectionDetails
    ) {
        return new ResponseEntity<>(
                studyPlanSectionService.editSectionDetails(studyPlanId, sectionId, sectionDetails),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{sectionId}")
    public ResponseEntity<StudyPlanDto> deleteSection(
            @PathVariable long studyPlanId,
            @PathVariable long sectionId
    ) {
        return new ResponseEntity<>(
                studyPlanSectionService.deleteSection(studyPlanId, sectionId),
                HttpStatus.OK
        );
    }

    @PutMapping("/{sectionId}/move")
    public ResponseEntity<StudyPlanDto> moveSection(
            @PathVariable long studyPlanId,
            @PathVariable long sectionId,
            @RequestParam(value = "direction", defaultValue = "") MoveDirection direction
    ) {
        return new ResponseEntity<>(
                studyPlanSectionService.moveSection(studyPlanId, sectionId, direction),
                HttpStatus.OK
        );
    }
}
