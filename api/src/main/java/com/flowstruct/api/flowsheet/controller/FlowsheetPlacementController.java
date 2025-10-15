package com.flowstruct.api.flowsheet.controller;

import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.dto.PlacementDto;
import com.flowstruct.api.flowsheet.service.FlowsheetPlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flowsheets/{flowsheetId}/placements")
public class FlowsheetPlacementController {
    private final FlowsheetPlacementService flowsheetPlacementService;

    @PostMapping
    public ResponseEntity<FlowsheetDto> placeCourses(
            @PathVariable long flowsheetId,
            @RequestParam(value = "courseIds", defaultValue = "") List<Long> courseIds,
            @RequestParam(value = "term", defaultValue = "1") int term
    ) {
        return new ResponseEntity<>(
                flowsheetPlacementService.placeCourses(flowsheetId, courseIds, term),
                HttpStatus.OK
        );
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<FlowsheetDto> movePlacement(
            @PathVariable long flowsheetId,
            @PathVariable long courseId,
            @Valid @RequestBody PlacementDto targetPlacement
    ) {
        return new ResponseEntity<>(
                flowsheetPlacementService.movePlacement(flowsheetId, courseId, targetPlacement),
                HttpStatus.OK
        );
    }

    @PutMapping("/{courseId}/resize")
    public ResponseEntity<FlowsheetDto> resizePlacement(
            @PathVariable long flowsheetId,
            @PathVariable long courseId,
            @RequestParam(value = "span", defaultValue = "1") int span
    ) {
        return new ResponseEntity<>(
                flowsheetPlacementService.resizePlacement(flowsheetId, courseId, span),
                HttpStatus.OK
        );
    }

    @DeleteMapping
    public ResponseEntity<FlowsheetDto> removePlacements(
            @PathVariable long flowsheetId,
            @RequestParam(value = "courseIds", defaultValue = "") List<Long> courseIds
    ) {
        return new ResponseEntity<>(
                flowsheetPlacementService.removePlacements(flowsheetId, courseIds),
                HttpStatus.OK
        );
    }
}
