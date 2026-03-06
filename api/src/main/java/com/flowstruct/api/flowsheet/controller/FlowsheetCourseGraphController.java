package com.flowstruct.api.flowsheet.controller;

import com.flowstruct.api.flowsheet.domain.Relation;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.service.FlowsheetCourseGraphService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flowsheets/{flowsheetId}/graph")
public class FlowsheetCourseGraphController {

  private final FlowsheetCourseGraphService flowsheetCourseGraphService;

  @PostMapping("/{courseId}/prerequisites")
  public ResponseEntity<FlowsheetDto> linkPrerequisites(
      @PathVariable long flowsheetId,
      @PathVariable long courseId,
      @RequestParam(value = "prerequisiteIds", defaultValue = "") List<Long> prerequisiteIds) {
    return new ResponseEntity<>(
        flowsheetCourseGraphService.linkPrerequisitesToCourse(
            flowsheetId, courseId, prerequisiteIds, Relation.AND),
        HttpStatus.OK);
  }

  @DeleteMapping("/{courseId}/prerequisites")
  public ResponseEntity<FlowsheetDto> unlinkPrerequisites(
      @PathVariable long flowsheetId,
      @PathVariable long courseId,
      @RequestParam(value = "prerequisiteIds", defaultValue = "") List<Long> prerequisiteIds) {
    return new ResponseEntity<>(
        flowsheetCourseGraphService.unlinkPrerequisitesFromCourse(
            flowsheetId, courseId, prerequisiteIds),
        HttpStatus.OK);
  }
}
