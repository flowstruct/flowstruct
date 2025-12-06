package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.flowsheet.domain.MoveDirection;
import com.flowstruct.api.flowsheet.domain.Section;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.dto.SectionDetailsDto;
import com.flowstruct.api.flowsheet.exception.NotEnoughSectionsException;
import com.flowstruct.api.flowsheet.exception.OutOfBoundsPositionException;
import com.flowstruct.api.flowsheet.exception.SectionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class FlowsheetSectionService {
  private final FlowsheetService flowsheetService;

  @Transactional(isolation = Isolation.READ_COMMITTED)
  public FlowsheetDto createSection(long flowsheetId, SectionDetailsDto details) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    Section newSection = new Section();
    newSection.setLevel(details.level());
    newSection.setType(details.type());
    newSection.setRequiredCreditHours(details.requiredCreditHours());
    newSection.setName(details.name().trim());

    var sectionSiblings = flowsheet.getSections()
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

    flowsheet.getSections().add(newSection);

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto editSectionDetails(long flowsheetId, long sectionId, SectionDetailsDto details) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    flowsheet.getSections().stream()
        .filter(s -> s.getId() == sectionId)
        .findFirst()
        .ifPresentOrElse(section -> {
          section.setLevel(details.level());
          section.setType(details.type());
          section.setRequiredCreditHours(details.requiredCreditHours());
          section.setName(details.name().trim());
        }, () -> {
          throw new SectionNotFoundException("Section was not found");
        });

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto deleteSection(long flowsheetId, long sectionId) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    var section = flowsheet.getSections().stream()
        .filter(s -> s.getId() == sectionId)
        .findFirst()
        .orElseThrow(() -> new SectionNotFoundException("Section not found"));

    var sectionSiblings = flowsheet.getSections()
        .stream()
        .filter(s -> s.getLevel() == section.getLevel() && s.getType() == section.getType())
        .toList();

    flowsheet.getSections().stream()
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

    flowsheet.getCoursePrerequisites()
        .removeIf(coursePrerequisite -> section.hasCourse(coursePrerequisite.getPrerequisite().getId()));

    flowsheet.getCourseCorequisites()
        .removeIf(courseCorequisite -> section.hasCourse(courseCorequisite.getCorequisite().getId()));

    flowsheet.getSections().remove(section);

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto moveSection(
      long flowsheetId,
      long sectionId,
      MoveDirection direction) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    var targetSection = flowsheet.getSections()
        .stream()
        .filter(s -> s.getId() == sectionId)
        .findFirst()
        .orElseThrow(() -> new SectionNotFoundException("Section not found."));

    var sectionsList = flowsheet.getSections()
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

    return flowsheetService.saveAndMap(flowsheet);
  }
}
