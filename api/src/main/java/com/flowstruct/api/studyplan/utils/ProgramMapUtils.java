package com.flowstruct.api.studyplan.utils;

import com.flowstruct.api.studyplan.domain.Placement;
import com.flowstruct.api.studyplan.domain.StudyPlan;
import org.springframework.stereotype.Service;

@Service
public class ProgramMapUtils {
    public void insertCoursePlacement(StudyPlan studyPlan, long courseId, Placement placement) {
        if (placement == null) return;
        shiftPositions(studyPlan, placement, +1);
        studyPlan.getCoursePlacements().put(courseId, placement);
    }

    public void deleteCoursePlacement(StudyPlan studyPlan, long courseId, Placement placement) {
        if (placement == null) return;
        studyPlan.getCoursePlacements().remove(courseId);
        shiftPositions(studyPlan, placement, -1);
    }

    public int comparePlacement(Placement p1, Placement p2) {
        if (p1.getYear() != p2.getYear()) {
            return Integer.compare(p1.getYear(), p2.getYear());
        }
        return Integer.compare(p1.getSemester(), p2.getSemester());
    }

    private void shiftPositions(StudyPlan studyPlan, Placement placement, int delta) {
        studyPlan.getCoursePlacements().values()
                .stream()
                .filter(p ->
                        p.getYear() == placement.getYear() &&
                                p.getSemester() == placement.getSemester() &&
                                p.getPosition() >= placement.getPosition()
                )
                .forEach(p -> p.setPosition(p.getPosition() + delta));
    }
}
