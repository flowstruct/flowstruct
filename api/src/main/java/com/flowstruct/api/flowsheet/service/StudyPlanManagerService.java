package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.common.exception.AlreadyApprovedException;
import com.flowstruct.api.common.exception.InvalidDetailsException;
import com.flowstruct.api.flowsheet.domain.Section;
import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.FlowsheetSnapshot;
import com.flowstruct.api.flowsheet.dto.StudyPlanDetailsDto;
import com.flowstruct.api.flowsheet.dto.StudyPlanDto;
import com.flowstruct.api.flowsheet.exception.StudyPlanNotFoundException;
import com.flowstruct.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class StudyPlanManagerService {
    private final StudyPlanService studyPlanService;
    private final UserService userService;

    @Transactional
    public StudyPlanDto discardStudyPlanChanges(long studyPlanId) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);
        FlowsheetSnapshot lastApprovedStudyPlan = studyPlan.getApprovedFlowsheet();

        if (lastApprovedStudyPlan == null) {
            throw new StudyPlanNotFoundException("No last approved version was found.");
        }

        if (Objects.equals(lastApprovedStudyPlan.getVersion(), studyPlan.getVersion())) {
            throw new AlreadyApprovedException("This version has already been approved.");
        }

        studyPlan.setYear(lastApprovedStudyPlan.getYear());
        studyPlan.setDuration(lastApprovedStudyPlan.getDuration());
        studyPlan.setTrack(lastApprovedStudyPlan.getTrack());
        studyPlan.setProgram(lastApprovedStudyPlan.getProgram());
        studyPlan.setSections(lastApprovedStudyPlan.getSections());
        studyPlan.setCoursePlacements(lastApprovedStudyPlan.getCoursePlacements());
        studyPlan.setCoursePrerequisites(lastApprovedStudyPlan.getCoursePrerequisites());
        studyPlan.setCourseCorequisites(lastApprovedStudyPlan.getCourseCorequisites());

        studyPlan.getApprovedFlowsheet().setVersion(studyPlan.getVersion() + 1);

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto cloneStudyPlan(long studyPlanToCloneId, StudyPlanDetailsDto cloneDetails) {
        var studyPlanToClone = studyPlanService.findOrThrow(studyPlanToCloneId);

        if (!Objects.equals(studyPlanToClone.getProgram().getId(), cloneDetails.program())) {
            throw new InvalidDetailsException("Cloned study plan must come from the same program.");
        }

        studyPlanToClone.getCoursePlacements()
                .entrySet()
                .removeIf(entry -> entry.getValue().getYear() > cloneDetails.duration());

        Set<Section> sectionClones = studyPlanToClone.getSections().stream()
                .map(section -> {
                    section.setId(null);
                    return section;
                })
                .collect(Collectors.toSet());

        Flowsheet flowsheetClone = new Flowsheet(
                null,
                cloneDetails.year(),
                cloneDetails.duration(),
                cloneDetails.track(),
                studyPlanToClone.getProgram(),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                sectionClones,
                studyPlanToClone.getCoursePlacements(),
                studyPlanToClone.getCoursePrerequisites(),
                studyPlanToClone.getCourseCorequisites()
        );

        return studyPlanService.saveAndMap(flowsheetClone);
    }

    @Transactional
    public StudyPlanDto editStudyPlanDetails(long studyPlanId, StudyPlanDetailsDto details) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        studyPlan.setYear(details.year());
        studyPlan.setDuration(details.duration());
        studyPlan.setTrack(details.track().trim());

        studyPlan.getCoursePlacements()
                .entrySet()
                .removeIf(entry -> entry.getValue().getYear() > studyPlan.getDuration());

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto createStudyPlan(StudyPlanDetailsDto details) {
        Flowsheet flowsheet = new Flowsheet(
                null,
                details.year(),
                details.duration(),
                details.track().trim(),
                AggregateReference.to(details.program()),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                new HashSet<>(),
                new HashMap<>(),
                new HashSet<>(),
                new HashSet<>()
        );

        return studyPlanService.saveAndMap(flowsheet);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public StudyPlanDto archiveStudyPlan(long id) {
        var studyPlan = studyPlanService.findOrThrow(id);
        var currentUser = userService.getCurrentUser();

        studyPlan.setArchivedAt(Instant.now());
        studyPlan.setArchivedBy(currentUser.getId());

        if (studyPlan.getApprovedFlowsheet() != null && Objects.equals(studyPlan.getApprovedFlowsheet().getVersion(), studyPlan.getVersion())) {
            studyPlan.getApprovedFlowsheet().setVersion(studyPlan.getVersion() + 1);
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public StudyPlanDto unarchiveStudyPlan(long id) {
        var studyPlan = studyPlanService.findOrThrow(id);

        studyPlan.setArchivedAt(null);
        studyPlan.setArchivedBy(null);

        if (studyPlan.getApprovedFlowsheet() != null && Objects.equals(studyPlan.getApprovedFlowsheet().getVersion(), studyPlan.getVersion())) {
            studyPlan.getApprovedFlowsheet().setVersion(studyPlan.getVersion() + 1);
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public StudyPlanDto approveStudyPlanChanges(long studyPlanId) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);
        FlowsheetSnapshot lastApprovedStudyPlan = studyPlan.getApprovedFlowsheet();

        if (lastApprovedStudyPlan != null && Objects.equals(lastApprovedStudyPlan.getVersion(), studyPlan.getVersion())) {
            throw new AlreadyApprovedException("This version has already been approved.");
        }

        studyPlan.setApprovedFlowsheet(new FlowsheetSnapshot(studyPlan));
        studyPlan.getApprovedFlowsheet().setVersion(studyPlan.getVersion() + 1);

        return studyPlanService.saveAndMap(studyPlan);
    }
}
