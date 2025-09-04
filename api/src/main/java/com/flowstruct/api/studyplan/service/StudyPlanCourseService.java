package com.flowstruct.api.studyplan.service;

import com.flowstruct.api.course.dto.CourseDto;
import com.flowstruct.api.course.dto.CourseSummaryDto;
import com.flowstruct.api.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudyPlanCourseService {
    private final StudyPlanService studyPlanService;
    private final CourseService courseService;

    public Map<Long, CourseSummaryDto> getStudyPlanCourseList(long studyPlanId) {
        var studyPlan = studyPlanService.getStudyPlan(studyPlanId);

        var courseIds = studyPlan.sections()
                .stream()
                .flatMap(s -> s.courses().stream())
                .toList();

        return courseService.getCourseList(courseIds);
    }

    public Map<Long, CourseDto> getStudyPlanDetailedCourseList(long studyPlanId) {
        var studyPlan = studyPlanService.getStudyPlan(studyPlanId);

        var courseIds = studyPlan.sections()
                .stream()
                .flatMap(s -> s.courses().stream())
                .toList();

        return courseService.getDetailedCourseList(courseIds);
    }
}
