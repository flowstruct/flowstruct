package com.flowstruct.api.flowsheet.controller;

import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.service.FlowsheetTermService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flowsheets/{flowsheetId}/terms")
public class FlowsheetTermController {

  private final FlowsheetTermService flowsheetTermService;

  @PostMapping
  public ResponseEntity<FlowsheetDto> addTerm(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(flowsheetTermService.addTerm(flowsheetId), HttpStatus.OK);
  }

  @PostMapping("/{termId}")
  public ResponseEntity<FlowsheetDto> placeCourses(
      @PathVariable long flowsheetId,
      @RequestParam(value = "courseIds", defaultValue = "") List<Long> courseIds,
      @PathVariable long termId) {
    return new ResponseEntity<>(
        flowsheetTermService.placeCourses(flowsheetId, courseIds, termId), HttpStatus.OK);
  }

  @PutMapping("/{termId}")
  public ResponseEntity<FlowsheetDto> moveCourse(
      @PathVariable long flowsheetId,
      @PathVariable long termId,
      @RequestParam(value = "courseId", defaultValue = "") Long courseId,
      @RequestParam(value = "position", defaultValue = "1") int targetPosition) {
    return new ResponseEntity<>(
        flowsheetTermService.moveCourse(flowsheetId, courseId, termId, targetPosition),
        HttpStatus.OK);
  }

  @PutMapping("/{courseId}/resize")
  public ResponseEntity<FlowsheetDto> resizePlacement(
      @PathVariable long flowsheetId,
      @PathVariable long courseId,
      @RequestParam(value = "span", defaultValue = "1") int span) {
    return new ResponseEntity<>(
        flowsheetTermService.resizePlacement(flowsheetId, courseId, span), HttpStatus.OK);
  }

  @DeleteMapping
  public ResponseEntity<FlowsheetDto> deleteLastTerm(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(flowsheetTermService.deleteLastTerm(flowsheetId), HttpStatus.OK);
  }

  @DeleteMapping("/placements")
  public ResponseEntity<FlowsheetDto> removePlacements(
      @PathVariable long flowsheetId,
      @RequestParam(value = "courseIds", defaultValue = "") List<Long> courseIds) {
    return new ResponseEntity<>(
        flowsheetTermService.removePlacements(flowsheetId, courseIds), HttpStatus.OK);
  }
}
