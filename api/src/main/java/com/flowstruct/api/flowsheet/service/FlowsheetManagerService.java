package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.common.exception.AlreadyApprovedException;
import com.flowstruct.api.common.exception.InvalidDetailsException;
import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.FlowsheetSnapshot;
import com.flowstruct.api.flowsheet.domain.Section;
import com.flowstruct.api.flowsheet.domain.Term;
import com.flowstruct.api.flowsheet.dto.FlowsheetDetailsDto;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.exception.FlowsheetNotFoundException;
import com.flowstruct.api.user.service.UserService;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class FlowsheetManagerService {

  private final FlowsheetService flowsheetService;

  private final UserService userService;

  @Transactional
  public FlowsheetDto discardFlowsheetChanges(long flowsheetId) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);
    FlowsheetSnapshot lastApprovedFlowsheet = flowsheet.getApprovedFlowsheet();

    if (lastApprovedFlowsheet == null) {
      throw new FlowsheetNotFoundException("No last approved version was found.");
    }

    if (Objects.equals(lastApprovedFlowsheet.getVersion(), flowsheet.getVersion())) {
      throw new AlreadyApprovedException("This version has already been approved.");
    }

    flowsheet.setYear(lastApprovedFlowsheet.getYear());
    flowsheet.setName(lastApprovedFlowsheet.getName());
    flowsheet.setProgram(lastApprovedFlowsheet.getProgram());
    flowsheet.setSections(lastApprovedFlowsheet.getSections());
    flowsheet.setTerms(lastApprovedFlowsheet.getTerms());
    flowsheet.setCoursePrerequisites(lastApprovedFlowsheet.getCoursePrerequisites());
    flowsheet.setCourseCorequisites(lastApprovedFlowsheet.getCourseCorequisites());

    flowsheet.getApprovedFlowsheet().setVersion(flowsheet.getVersion() + 1);

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto cloneFlowsheet(long flowsheetToCloneId, FlowsheetDetailsDto cloneDetails) {
    var flowsheetToClone = flowsheetService.findOrThrow(flowsheetToCloneId);

    if (!Objects.equals(flowsheetToClone.getProgram().getId(), cloneDetails.program())) {
      throw new InvalidDetailsException("Cloned study plan must come from the same program.");
    }

    Set<Section> sectionClones =
        flowsheetToClone.getSections().stream()
            .peek(s -> s.setId(null))
            .collect(Collectors.toSet());

    Set<Term> termClones =
        flowsheetToClone.getTerms().stream().peek(t -> t.setId(null)).collect(Collectors.toSet());

    Flowsheet flowsheetClone =
        new Flowsheet(
            null,
            cloneDetails.year(),
            cloneDetails.name(),
            flowsheetToClone.getProgram(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            sectionClones,
            termClones,
            flowsheetToClone.getCoursePrerequisites(),
            flowsheetToClone.getCourseCorequisites());

    return flowsheetService.saveAndMap(flowsheetClone);
  }

  @Transactional
  public FlowsheetDto editFlowsheetDetails(long flowsheetId, FlowsheetDetailsDto details) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    flowsheet.setYear(details.year());
    flowsheet.setName(details.name().trim());

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto createFlowsheet(FlowsheetDetailsDto details) {
    Flowsheet flowsheet =
        new Flowsheet(
            null,
            details.year(),
            details.name().trim(),
            AggregateReference.to(details.program()),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            new HashSet<>(),
            new HashSet<>(Set.of(new Term(null, 1, null, new HashSet<>()))),
            new HashSet<>(),
            new HashSet<>());

    return flowsheetService.saveAndMap(flowsheet);
  }

  @PreAuthorize("hasRole('ROLE_APPROVER')")
  @Transactional
  public FlowsheetDto archiveFlowsheet(long flowsheetId) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);
    var currentUser = userService.getCurrentUser();

    flowsheet.setArchivedAt(Instant.now());
    flowsheet.setArchivedBy(currentUser.getId());

    if (flowsheet.getApprovedFlowsheet() != null
        && Objects.equals(flowsheet.getApprovedFlowsheet().getVersion(), flowsheet.getVersion())) {
      flowsheet.getApprovedFlowsheet().setVersion(flowsheet.getVersion() + 1);
    }

    return flowsheetService.saveAndMap(flowsheet);
  }

  @PreAuthorize("hasRole('ROLE_APPROVER')")
  @Transactional
  public FlowsheetDto unarchiveFlowsheet(long flowsheetId) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    flowsheet.setArchivedAt(null);
    flowsheet.setArchivedBy(null);

    if (flowsheet.getApprovedFlowsheet() != null
        && Objects.equals(flowsheet.getApprovedFlowsheet().getVersion(), flowsheet.getVersion())) {
      flowsheet.getApprovedFlowsheet().setVersion(flowsheet.getVersion() + 1);
    }

    return flowsheetService.saveAndMap(flowsheet);
  }

  @PreAuthorize("hasRole('ROLE_APPROVER')")
  @Transactional
  public FlowsheetDto approveFlowsheetChanges(long flowsheetId) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);
    FlowsheetSnapshot lastApprovedStudyPlan = flowsheet.getApprovedFlowsheet();

    if (lastApprovedStudyPlan != null
        && Objects.equals(lastApprovedStudyPlan.getVersion(), flowsheet.getVersion())) {
      throw new AlreadyApprovedException("This version has already been approved.");
    }

    flowsheet.setApprovedFlowsheet(new FlowsheetSnapshot(flowsheet));
    flowsheet.getApprovedFlowsheet().setVersion(flowsheet.getVersion() + 1);

    return flowsheetService.saveAndMap(flowsheet);
  }
}
