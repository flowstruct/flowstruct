package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.dto.StudyPlanDto;
import com.flowstruct.api.flowsheet.dto.StudyPlanSummaryDto;
import com.flowstruct.api.flowsheet.exception.StudyPlanNotFoundException;
import com.flowstruct.api.flowsheet.mapper.StudyPlanDtoMapper;
import com.flowstruct.api.flowsheet.mapper.StudyPlanSummaryDtoMapper;
import com.flowstruct.api.flowsheet.repository.StudyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class StudyPlanService {
    private final StudyPlanRepository studyPlanRepository;
    private final StudyPlanDtoMapper studyPlanDtoMapper;
    private final StudyPlanSummaryDtoMapper studyPlanSummaryDtoMapper;

    public StudyPlanDto getStudyPlan(long studyPlanId) {
        var studyPlan = findOrThrow(studyPlanId);
        return studyPlanDtoMapper.apply(studyPlan);
    }

    public Optional<StudyPlanDto> getApprovedStudyPlan(long studyPlanId) {
        var studyPlan = findOrThrow(studyPlanId);

        if (studyPlan.getApprovedFlowsheet() == null || studyPlan.getArchivedAt() != null) {
            return Optional.empty();
        }

        var approvedStudyPlan = new Flowsheet(
                studyPlan.getId(),
                studyPlan.getApprovedFlowsheet().getYear(),
                studyPlan.getApprovedFlowsheet().getDuration(),
                studyPlan.getApprovedFlowsheet().getTrack(),
                studyPlan.getApprovedFlowsheet().getProgram(),
                studyPlan.getApprovedFlowsheet(),
                null,
                null,
                studyPlan.getApprovedFlowsheet().getVersion(),
                studyPlan.getCreatedAt(),
                studyPlan.getUpdatedAt(),
                studyPlan.getUpdatedBy(),
                studyPlan.getApprovedFlowsheet().getSections(),
                studyPlan.getApprovedFlowsheet().getCoursePlacements(),
                studyPlan.getApprovedFlowsheet().getCoursePrerequisites(),
                studyPlan.getApprovedFlowsheet().getCourseCorequisites()
        );

        return Optional.of(studyPlanDtoMapper.apply(approvedStudyPlan));
    }


    public List<StudyPlanSummaryDto> getAllStudyPlans() {
        return studyPlanRepository.findAllStudyPlanSummaries()
                .stream()
                .map(studyPlanSummaryDtoMapper)
                .toList();
    }

    public Flowsheet findOrThrow(long studyPlanId) {
        return studyPlanRepository.findById(studyPlanId)
                .orElseThrow(() -> new StudyPlanNotFoundException("Study plan was not found."));
    }

    public StudyPlanDto saveAndMap(Flowsheet flowsheet) {
        try {
            Flowsheet savedFlowsheet = studyPlanRepository.save(flowsheet);
            return studyPlanDtoMapper.apply(savedFlowsheet);
        } catch (OptimisticLockingFailureException e) {
            throw new OptimisticLockingFailureException(
                    "This study plan has been modified by another user while you were editing. Please refresh to see the latest version."
            );
        }
    }
}
