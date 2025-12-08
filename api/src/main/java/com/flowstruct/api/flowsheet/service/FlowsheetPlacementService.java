package com.flowstruct.api.flowsheet.service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.Placement;
import com.flowstruct.api.flowsheet.domain.Term;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.exception.CourseAlreadyPlacedException;
import com.flowstruct.api.flowsheet.exception.CourseNotPlacedException;
import com.flowstruct.api.flowsheet.exception.InvalidCoursePlacement;
import com.flowstruct.api.flowsheet.exception.InvalidSpanException;
import com.flowstruct.api.flowsheet.utils.PlacementUtils;

import lombok.RequiredArgsConstructor;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class FlowsheetPlacementService {
  private final FlowsheetService flowsheetService;
  private final PlacementUtils placementUtils;

  @Transactional
  public FlowsheetDto placeCourses(long flowsheetId, List<Long> courseIds, long termId) {
    Flowsheet flowsheet = flowsheetService.findOrThrow(flowsheetId);

    Map<Long, Placement> termAndPlacementByCourse = flowsheet.getPlacementsByCourse();

    for (var courseId : courseIds) {
      if (termAndPlacementByCourse.containsKey(courseId)) {
        throw new CourseAlreadyPlacedException("Course is already placed.");
      }
    }

    Term term = flowsheet.getTerms().stream()
        .filter(t -> t.getId() == termId)
        .findFirst()
        .orElseThrow(() -> {
          throw new NoSuchElementException("Term was not found.");
        });

    int delta = courseIds.size();

    for (var placement : term.getPlacements()) {
      placement.setPosition(placement.getPosition() + delta);
    }

    int position = 1;
    for (var courseId : courseIds) {
      Placement newPlacement = new Placement(
          AggregateReference.to(courseId),
          position++,
          1);
      term.getPlacements().add(newPlacement);
    }

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto moveCourse(
      long flowsheetId,
      long courseId,
      long targetTermId,
      int targetPosition) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    Map<Long, TermPlacementPair> termAndPlacementByCourse = flowsheet.getTerms().stream()
        .flatMap(term -> term.getPlacements().stream()
            .map(placement -> Map.entry(
                placement.getCourse().getId(),
                new TermPlacementPair(term, placement))))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    var oldPair = termAndPlacementByCourse.get(courseId);

    if (oldPair == null) {
      throw new CourseNotPlacedException("Course has no initial placement.");
    }

    var oldTerm = oldPair.term;
    var oldPlacement = oldPair.placement;

    var newTerm = flowsheet.getTerms().stream()
        .filter(t -> t.getId().equals(targetTermId))
        .findFirst()
        .orElseThrow(() -> new InvalidCoursePlacement("Target term not found."));

    var newPlacement = new Placement(
        AggregateReference.to(courseId),
        targetPosition,
        oldPlacement.getSpan());

    if (oldTerm.getId().equals(newTerm.getId()) &&
        oldPlacement.getPosition() == newPlacement.getPosition()) {
      throw new InvalidCoursePlacement("Course is already in the same placement.");
    }

    boolean prerequisitesFulfilled = flowsheet.getCoursePrerequisites()
        .stream()
        .filter(cp -> Objects.equals(cp.getCourse().getId(), courseId))
        .allMatch(cp -> {
          var prereqPair = termAndPlacementByCourse.get(cp.getPrerequisite().getId());

          if (prereqPair == null) {
            return true;
          }

          return placementUtils.compareTerms(prereqPair.term, newTerm) < 0;
        });

    if (!prerequisitesFulfilled) {
      throw new InvalidCoursePlacement("Course must come after its prerequisites.");
    }

    boolean postrequisitesFulfilled = flowsheet.getCoursePrerequisites()
        .stream()
        .filter(cp -> Objects.equals(cp.getPrerequisite().getId(), courseId))
        .allMatch(cp -> {
          var postreqPair = termAndPlacementByCourse.get(cp.getCourse().getId());

          if (postreqPair == null) {
            return true;
          }

          return placementUtils.compareTerms(postreqPair.term, newTerm) > 0;
        });

    if (!postrequisitesFulfilled) {
      throw new InvalidCoursePlacement("Course must come before its postrequisites.");
    }

    placementUtils.deleteCoursePlacement(oldTerm, oldPlacement);
    placementUtils.insertCoursePlacement(newTerm, newPlacement);

    return flowsheetService.saveAndMap(flowsheet);
  }

  private static class TermPlacementPair {
    final Term term;
    final Placement placement;

    TermPlacementPair(Term term, Placement placement) {
      this.term = term;
      this.placement = placement;
    }
  }

  @Transactional
  public FlowsheetDto resizePlacement(long flowsheetId, long courseId, int span) {
    if (span < 1 || span > 5) {
      throw new InvalidSpanException("A course cannot span less than 1 or larger than 5 courses.");
    }

    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    var placementsMap = flowsheet.getPlacementsByCourse();
    var coursePlacement = placementsMap.get(courseId);

    if (coursePlacement == null) {
      throw new CourseNotPlacedException("Course not placed in a term");
    }

    coursePlacement.setSpan(span);

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto removePlacements(long flowsheetId, List<Long> courseIds) {
    Flowsheet flowsheet = flowsheetService.findOrThrow(flowsheetId);

    Map<Long, TermPlacementPair> termAndPlacementByCourse = flowsheet.getTerms().stream()
        .flatMap(term -> term.getPlacements().stream()
            .map(placement -> Map.entry(
                placement.getCourse().getId(),
                new TermPlacementPair(term, placement))))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    for (var courseId : courseIds) {
      flowsheet.getSections().forEach(section -> section.removeCourse(courseId));

      flowsheet.getCoursePrerequisites()
          .removeIf(coursePrerequisite -> Objects.equals(coursePrerequisite.getCourse().getId(), courseId)
              || Objects.equals(coursePrerequisite.getPrerequisite().getId(), courseId));

      flowsheet.getCourseCorequisites()
          .removeIf(courseCorequisite -> Objects.equals(courseCorequisite.getCourse().getId(), courseId)
              || Objects.equals(courseCorequisite.getCorequisite().getId(), courseId));

      var pair = termAndPlacementByCourse.get(courseId);

      if (pair != null) {
        placementUtils.deleteCoursePlacement(pair.term, pair.placement);
      }
    }

    return flowsheetService.saveAndMap(flowsheet);
  }
}
