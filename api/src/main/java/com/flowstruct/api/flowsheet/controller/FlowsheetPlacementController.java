package com.flowstruct.api.flowsheet.controller;

import com.flowstruct.api.flowsheet.dto.PlacementDto;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.service.FlowsheetPlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/study-plans/{flowsheetId}/placements")
public class FlowsheetPlacementController {
    private final FlowsheetPlacementService flowsheetPlacementService;

    @PostMapping
    public ResponseEntity<FlowsheetDto> placeCourses(
            @PathVariable long flowsheetId,
            @RequestParam(value = "courses", defaultValue = "") List<Long> courseIds,
            @Valid @RequestBody PlacementDto targetPlacement
    ) {
        return new ResponseEntity<>(
                flowsheetPlacementService.placeCourses(flowsheetId, courseIds, targetPlacement),
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

    @DeleteMapping("/{courseId}")
    public ResponseEntity<FlowsheetDto> removePlacement(
            @PathVariable long flowsheetId,
            @PathVariable long courseId
    ) {
        return new ResponseEntity<>(
                flowsheetPlacementService.removePlacement(flowsheetId, courseId),
                HttpStatus.OK
        );
    }
}
