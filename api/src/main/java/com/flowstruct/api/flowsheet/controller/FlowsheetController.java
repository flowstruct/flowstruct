package com.flowstruct.api.flowsheet.controller;

import com.flowstruct.api.flowsheet.dto.FlowsheetDetailsDto;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.dto.FlowsheetSummaryDto;
import com.flowstruct.api.flowsheet.service.FlowsheetManagerService;
import com.flowstruct.api.flowsheet.service.FlowsheetService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flowsheets")
public class FlowsheetController {

  private final FlowsheetService flowsheetService;

  private final FlowsheetManagerService flowsheetManagerService;

  @GetMapping
  public ResponseEntity<List<FlowsheetSummaryDto>> getAllFlowsheets() {
    return new ResponseEntity<>(flowsheetService.getAllFlowsheets(), HttpStatus.OK);
  }

  @GetMapping("/{flowsheetId}/approved")
  public ResponseEntity<FlowsheetDto> getFlowsheetIfApproved(@PathVariable long flowsheetId) {
    return flowsheetService
        .getFlowsheetIfApproved(flowsheetId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping("/{flowsheetId}")
  public ResponseEntity<FlowsheetDto> getFlowsheet(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(flowsheetService.getFlowsheet(flowsheetId), HttpStatus.OK);
  }

  @PutMapping("/{flowsheetId}/approve-changes")
  public ResponseEntity<FlowsheetDto> approveFlowsheetChanges(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(
        flowsheetManagerService.approveFlowsheetChanges(flowsheetId), HttpStatus.OK);
  }

  @PutMapping("/{flowsheetId}/discard-changes")
  public ResponseEntity<FlowsheetDto> discardFlowsheetChanges(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(
        flowsheetManagerService.discardFlowsheetChanges(flowsheetId), HttpStatus.OK);
  }

  @PutMapping("/{flowsheetId}")
  public ResponseEntity<FlowsheetDto> editFlowsheetDetails(
      @PathVariable long flowsheetId, @Valid @RequestBody FlowsheetDetailsDto studyPlanDetails) {
    return new ResponseEntity<>(
        flowsheetManagerService.editFlowsheetDetails(flowsheetId, studyPlanDetails), HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<FlowsheetDto> createFlowsheet(
      @Valid @RequestBody FlowsheetDetailsDto studyPlanDetails) {
    return new ResponseEntity<>(
        flowsheetManagerService.createFlowsheet(studyPlanDetails), HttpStatus.OK);
  }

  @PutMapping("/{flowsheetId}/archive")
  public ResponseEntity<FlowsheetDto> archiveFlowsheet(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(
        flowsheetManagerService.archiveFlowsheet(flowsheetId), HttpStatus.OK);
  }

  @PutMapping("/{flowsheetId}/unarchive")
  public ResponseEntity<FlowsheetDto> unarchiveFlowsheet(@PathVariable long flowsheetId) {
    return new ResponseEntity<>(
        flowsheetManagerService.unarchiveFlowsheet(flowsheetId), HttpStatus.OK);
  }

  @PostMapping("/{flowsheetId}/clone")
  public ResponseEntity<FlowsheetDto> cloneFlowsheet(
      @PathVariable long flowsheetId, @Valid @RequestBody FlowsheetDetailsDto cloneDetails) {
    return new ResponseEntity<>(
        flowsheetManagerService.cloneFlowsheet(flowsheetId, cloneDetails), HttpStatus.OK);
  }
}
