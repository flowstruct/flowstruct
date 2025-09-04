package com.flowstruct.api.studyplan.service;

import com.flowstruct.api.common.exception.AlreadyApprovedException;
import com.flowstruct.api.common.exception.InvalidDetailsException;
import com.flowstruct.api.studyplan.domain.Section;
import com.flowstruct.api.studyplan.domain.StudyPlan;
import com.flowstruct.api.studyplan.domain.StudyPlanDraft;
import com.flowstruct.api.studyplan.dto.StudyPlanDetailsDto;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import com.flowstruct.api.studyplan.exception.StudyPlanNotFoundException;
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
        StudyPlanDraft lastApprovedStudyPlan = studyPlan.getApprovedStudyPlan();

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

        studyPlan.getApprovedStudyPlan().setVersion(studyPlan.getVersion() + 1);

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

        StudyPlan studyPlanClone = new StudyPlan(
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

        return studyPlanService.saveAndMap(studyPlanClone);
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
        StudyPlan studyPlan = new StudyPlan(
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

        return studyPlanService.saveAndMap(studyPlan);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public StudyPlanDto archiveStudyPlan(long id) {
        var studyPlan = studyPlanService.findOrThrow(id);
        var currentUser = userService.getCurrentUser();

        studyPlan.setArchivedAt(Instant.now());
        studyPlan.setArchivedBy(currentUser.getId());

        if (studyPlan.getApprovedStudyPlan() != null && Objects.equals(studyPlan.getApprovedStudyPlan().getVersion(), studyPlan.getVersion())) {
            studyPlan.getApprovedStudyPlan().setVersion(studyPlan.getVersion() + 1);
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public StudyPlanDto unarchiveStudyPlan(long id) {
        var studyPlan = studyPlanService.findOrThrow(id);

        studyPlan.setArchivedAt(null);
        studyPlan.setArchivedBy(null);

        if (studyPlan.getApprovedStudyPlan() != null && Objects.equals(studyPlan.getApprovedStudyPlan().getVersion(), studyPlan.getVersion())) {
            studyPlan.getApprovedStudyPlan().setVersion(studyPlan.getVersion() + 1);
        }

        return studyPlanService.saveAndMap(studyPlan);
    }

    @PreAuthorize("hasRole('ROLE_APPROVER')")
    @Transactional
    public StudyPlanDto approveStudyPlanChanges(long studyPlanId) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);
        StudyPlanDraft lastApprovedStudyPlan = studyPlan.getApprovedStudyPlan();

        if (lastApprovedStudyPlan != null && Objects.equals(lastApprovedStudyPlan.getVersion(), studyPlan.getVersion())) {
            throw new AlreadyApprovedException("This version has already been approved.");
        }

        studyPlan.setApprovedStudyPlan(new StudyPlanDraft(studyPlan));
        studyPlan.getApprovedStudyPlan().setVersion(studyPlan.getVersion() + 1);

        return studyPlanService.saveAndMap(studyPlan);
    }
}
