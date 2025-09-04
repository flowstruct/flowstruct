package com.flowstruct.api.studyplan.domain;

import com.flowstruct.api.program.domain.Program;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jdbc.core.mapping.AggregateReference;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlanDraft {
    private int year;
    private int duration;
    private String track;
    private AggregateReference<Program, Long> program;
    private Set<Section> sections;
    private Map<Long, Placement> coursePlacements;
    private Set<CoursePrerequisite> coursePrerequisites;
    private Set<CourseCorequisite> courseCorequisites;
    private Long version;

    public StudyPlanDraft(StudyPlan studyPlan) {
        this.year = studyPlan.getYear();
        this.duration = studyPlan.getDuration();
        this.track = studyPlan.getTrack();
        this.program = studyPlan.getProgram();
        this.version = studyPlan.getVersion();

        this.sections = studyPlan.getSections().stream()
                .map(Section::new)
                .collect(Collectors.toSet());

        this.coursePlacements = studyPlan.getCoursePlacements().entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> new Placement(e.getValue())
                ));

        this.coursePrerequisites = studyPlan.getCoursePrerequisites().stream()
                .map(CoursePrerequisite::new)
                .collect(Collectors.toSet());

        this.courseCorequisites = studyPlan.getCourseCorequisites().stream()
                .map(CourseCorequisite::new)
                .collect(Collectors.toSet());
    }
}
