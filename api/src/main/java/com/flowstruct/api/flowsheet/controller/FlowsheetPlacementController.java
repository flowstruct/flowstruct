package com.flowstruct.api.flowsheet.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.service.FlowsheetPlacementService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flowsheets/{flowsheetId}/placements")
public class FlowsheetPlacementController {
  private final FlowsheetPlacementService flowsheetPlacementService;

  @PostMapping
  public ResponseEntity<FlowsheetDto> placeCourses(
      @PathVariable long flowsheetId,
      @RequestParam(value = "courseIds", defaultValue = "") List<Long> courseIds,
      @RequestParam(value = "termId", defaultValue = "") Long termId) {
    return new ResponseEntity<>(
        flowsheetPlacementService.placeCourses(flowsheetId, courseIds, termId),
        HttpStatus.OK);
  }

  @PutMapping("/{courseId}")
  public ResponseEntity<FlowsheetDto> moveCourse(
      @PathVariable long flowsheetId,
      @PathVariable long courseId,
      @RequestParam(value = "term", defaultValue = "") Long targetTermId,
      @RequestParam(value = "position", defaultValue = "1") int targetPosition) {
    return new ResponseEntity<>(
        flowsheetPlacementService.moveCourse(flowsheetId, courseId, targetTermId, targetPosition),
        HttpStatus.OK);
  }

  @PutMapping("/{courseId}/resize")
  public ResponseEntity<FlowsheetDto> resizePlacement(
      @PathVariable long flowsheetId,
      @PathVariable long courseId,
      @RequestParam(value = "span", defaultValue = "1") int span) {
    return new ResponseEntity<>(
        flowsheetPlacementService.resizePlacement(flowsheetId, courseId, span),
        HttpStatus.OK);
  }

  @DeleteMapping
  public ResponseEntity<FlowsheetDto> removePlacements(
      @PathVariable long flowsheetId,
      @RequestParam(value = "courseIds", defaultValue = "") List<Long> courseIds) {
    return new ResponseEntity<>(
        flowsheetPlacementService.removePlacements(flowsheetId, courseIds),
        HttpStatus.OK);
  }
}
