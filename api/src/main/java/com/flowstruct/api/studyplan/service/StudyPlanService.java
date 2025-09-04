package com.flowstruct.api.studyplan.service;

import com.flowstruct.api.studyplan.domain.StudyPlan;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import com.flowstruct.api.studyplan.dto.StudyPlanSummaryDto;
import com.flowstruct.api.studyplan.exception.StudyPlanNotFoundException;
import com.flowstruct.api.studyplan.mapper.StudyPlanDtoMapper;
import com.flowstruct.api.studyplan.mapper.StudyPlanSummaryDtoMapper;
import com.flowstruct.api.studyplan.repository.StudyPlanRepository;
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

        if (studyPlan.getApprovedStudyPlan() == null || studyPlan.getArchivedAt() != null) {
            return Optional.empty();
        }

        var approvedStudyPlan = new StudyPlan(
                studyPlan.getId(),
                studyPlan.getApprovedStudyPlan().getYear(),
                studyPlan.getApprovedStudyPlan().getDuration(),
                studyPlan.getApprovedStudyPlan().getTrack(),
                studyPlan.getApprovedStudyPlan().getProgram(),
                studyPlan.getApprovedStudyPlan(),
                null,
                null,
                studyPlan.getApprovedStudyPlan().getVersion(),
                studyPlan.getCreatedAt(),
                studyPlan.getUpdatedAt(),
                studyPlan.getUpdatedBy(),
                studyPlan.getApprovedStudyPlan().getSections(),
                studyPlan.getApprovedStudyPlan().getCoursePlacements(),
                studyPlan.getApprovedStudyPlan().getCoursePrerequisites(),
                studyPlan.getApprovedStudyPlan().getCourseCorequisites()
        );

        return Optional.of(studyPlanDtoMapper.apply(approvedStudyPlan));
    }


    public List<StudyPlanSummaryDto> getAllStudyPlans() {
        return studyPlanRepository.findAllStudyPlanSummaries()
                .stream()
                .map(studyPlanSummaryDtoMapper)
                .toList();
    }

    public StudyPlan findOrThrow(long studyPlanId) {
        return studyPlanRepository.findById(studyPlanId)
                .orElseThrow(() -> new StudyPlanNotFoundException("Study plan was not found."));
    }

    public StudyPlanDto saveAndMap(StudyPlan studyPlan) {
        try {
            StudyPlan savedStudyPlan = studyPlanRepository.save(studyPlan);
            return studyPlanDtoMapper.apply(savedStudyPlan);
        } catch (OptimisticLockingFailureException e) {
            throw new OptimisticLockingFailureException(
                    "This study plan has been modified by another user while you were editing. Please refresh to see the latest version."
            );
        }
    }
}
