package com.flowstruct.api.studyplan.service;

import com.flowstruct.api.studyplan.domain.MoveDirection;
import com.flowstruct.api.studyplan.domain.Section;
import com.flowstruct.api.studyplan.dto.SectionDetailsDto;
import com.flowstruct.api.studyplan.dto.StudyPlanDto;
import com.flowstruct.api.studyplan.exception.NotEnoughSectionsException;
import com.flowstruct.api.studyplan.exception.OutOfBoundsPositionException;
import com.flowstruct.api.studyplan.exception.SectionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class StudyPlanSectionService {
    private final StudyPlanService studyPlanService;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public StudyPlanDto createSection(long studyPlanId, SectionDetailsDto details) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        Section newSection = new Section();
        newSection.setLevel(details.level());
        newSection.setType(details.type());
        newSection.setRequiredCreditHours(details.requiredCreditHours());
        newSection.setName(details.name().trim());

        var sectionSiblings = studyPlan.getSections()
                .stream()
                .filter(s -> s.getLevel() == newSection.getLevel() && s.getType() == newSection.getType())
                .toList();

        if (sectionSiblings.isEmpty()) {
            newSection.setPosition(0);
        } else if (sectionSiblings.size() == 1 && sectionSiblings.getFirst().getPosition() == 0) {
            sectionSiblings.getFirst().setPosition(1);
            newSection.setPosition(2);
        } else {
            newSection.setPosition(sectionSiblings.size() + 1);
        }

        studyPlan.getSections().add(newSection);

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto editSectionDetails(long studyPlanId, long sectionId, SectionDetailsDto details) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        studyPlan.getSections().stream()
                .filter(s -> s.getId() == sectionId)
                .findFirst()
                .ifPresentOrElse(section -> {
                            section.setLevel(details.level());
                            section.setType(details.type());
                            section.setRequiredCreditHours(details.requiredCreditHours());
                            section.setName(details.name().trim());
                        }, () -> {
                            throw new SectionNotFoundException("Section was not found");
                        }
                );

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto deleteSection(long studyPlanId, long sectionId) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        var section = studyPlan.getSections().stream()
                .filter(s -> s.getId() == sectionId)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Section not found"));

        var sectionSiblings = studyPlan.getSections()
                .stream()
                .filter(s -> s.getLevel() == section.getLevel() && s.getType() == section.getType())
                .toList();

        studyPlan.getSections().stream()
                .filter(s -> s.getLevel() == section.getLevel() &&
                        s.getType() == section.getType() &&
                        s.getPosition() > section.getPosition())
                .forEach(s -> s.setPosition(s.getPosition() - 1));

        if (sectionSiblings.size() == 2) {
            var remainingSection = sectionSiblings.stream()
                    .filter(s -> s.getId() != sectionId)
                    .findFirst()
                    .orElseThrow();
            remainingSection.setPosition(0);
        }

        section.getCourses().forEach(sectionCourse -> studyPlan.getCoursePlacements().remove(sectionCourse.getCourse().getId()));

        studyPlan.getCoursePrerequisites().removeIf(coursePrerequisite ->
                section.hasCourse(coursePrerequisite.getPrerequisite().getId())
        );

        studyPlan.getCourseCorequisites().removeIf(courseCorequisite ->
                section.hasCourse(courseCorequisite.getCorequisite().getId())
        );

        studyPlan.getSections().remove(section);

        return studyPlanService.saveAndMap(studyPlan);
    }

    @Transactional
    public StudyPlanDto moveSection(
            long studyPlanId,
            long sectionId,
            MoveDirection direction
    ) {
        var studyPlan = studyPlanService.findOrThrow(studyPlanId);

        var targetSection = studyPlan.getSections()
                .stream()
                .filter(s -> s.getId() == sectionId)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Section not found."));

        var sectionsList = studyPlan.getSections()
                .stream()
                .filter(s -> s.getLevel() == targetSection.getLevel() && s.getType() == targetSection.getType())
                .toList();

        if (sectionsList.size() <= 1) {
            throw new NotEnoughSectionsException("More than one section is required to move section positions.");
        }

        if (targetSection.getPosition() == 1 && direction == MoveDirection.UP) {
            throw new OutOfBoundsPositionException("Section is already at first position.");
        }

        if (targetSection.getPosition() == sectionsList.size() && direction == MoveDirection.DOWN) {
            throw new OutOfBoundsPositionException("Section is already at last position.");
        }

        int currentPosition = targetSection.getPosition();
        int newPosition = direction == MoveDirection.UP ? currentPosition - 1 : currentPosition + 1;

        var swappedSection = sectionsList.stream()
                .filter(s -> s.getPosition() == newPosition)
                .findFirst()
                .orElseThrow(() -> new SectionNotFoundException("Cannot move into an unknown section."));

        targetSection.setPosition(newPosition);
        swappedSection.setPosition(currentPosition);

        return studyPlanService.saveAndMap(studyPlan);
    }
}
