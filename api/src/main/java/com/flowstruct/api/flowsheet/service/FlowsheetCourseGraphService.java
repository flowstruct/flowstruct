package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.course.exception.CourseNotFoundException;
import com.flowstruct.api.flowsheet.domain.CourseCorequisite;
import com.flowstruct.api.flowsheet.domain.CoursePrerequisite;
import com.flowstruct.api.flowsheet.domain.Relation;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.utils.CourseGraphUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@PreAuthorize("hasRole('ROLE_EDITOR')")
@RequiredArgsConstructor
@Service
public class FlowsheetCourseGraphService {

  private final FlowsheetService flowsheetService;

  private final CourseGraphUtils courseGraphUtils;

  @Transactional
  public FlowsheetDto linkPrerequisitesToCourse(
      long flowsheetId, long courseId, List<Long> prerequisites, Relation relation) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    courseGraphUtils.validatePrerequisites(courseId, flowsheet, prerequisites);

    for (var prerequisite : prerequisites) {
      flowsheet
          .getCoursePrerequisites()
          .add(
              new CoursePrerequisite(
                  AggregateReference.to(courseId), AggregateReference.to(prerequisite), relation));
    }

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto linkCorequisitesToCourse(
      long flowsheetId, long courseId, List<Long> corequisiteIds) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    for (var corequisiteId : corequisiteIds) {
      flowsheet
          .getCourseCorequisites()
          .add(
              new CourseCorequisite(
                  AggregateReference.to(courseId), AggregateReference.to(corequisiteId)));
    }

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto unlinkCorequisitesFromCourse(
      long flowsheetId, long courseId, long corequisiteId) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    boolean removed =
        flowsheet
            .getCourseCorequisites()
            .removeIf(
                courseCorequisite ->
                    courseCorequisite.getCourse().getId() == courseId
                        && courseCorequisite.getCorequisite().getId() == corequisiteId);

    if (!removed) throw new CourseNotFoundException("Corequisite not found");

    return flowsheetService.saveAndMap(flowsheet);
  }

  @Transactional
  public FlowsheetDto unlinkPrerequisitesFromCourse(
      long flowsheetId, long courseId, List<Long> prerequisiteIds) {
    var flowsheet = flowsheetService.findOrThrow(flowsheetId);

    for (long prerequisiteId : prerequisiteIds) {
      boolean removed =
          flowsheet
              .getCoursePrerequisites()
              .removeIf(
                  coursePrerequisite ->
                      coursePrerequisite.getCourse().getId() == courseId
                          && coursePrerequisite.getPrerequisite().getId() == prerequisiteId);

      if (!removed) throw new CourseNotFoundException("Prerequisite not found");
    }

    return flowsheetService.saveAndMap(flowsheet);
  }

  // @Transactional
  // public FlowsheetDto moveCourseToSection(
  // long flowsheetId,
  // List<Long> courseIds,
  // long targetSectionId
  // ) {
  // var flowsheet = flowsheetService.findOrThrow(flowsheetId);
  //
  // var targetSection = flowsheet.getSections().stream()
  // .filter(section -> section.getId() == targetSectionId)
  // .findFirst()
  // .orElseThrow(() -> new SectionNotFoundException("Target section not found"));
  //
  // for (long courseId : courseIds) {
  // flowsheet.getSections().forEach(section -> section.removeCourse(courseId));
  //
  // if (targetSection.getType() == SectionType.Elective ||
  // targetSection.getType() == SectionType.Remedial) {
  // flowsheet.getPlacements().remove(courseId);
  // }
  //
  // targetSection.addCourse(courseId);
  // }
  //
  // return flowsheetService.saveAndMap(flowsheet);
  // }
}
