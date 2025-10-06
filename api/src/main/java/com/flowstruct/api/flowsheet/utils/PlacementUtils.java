package com.flowstruct.api.flowsheet.utils;

import com.flowstruct.api.flowsheet.domain.Placement;
import com.flowstruct.api.flowsheet.domain.Flowsheet;
import org.springframework.stereotype.Service;

@Service
public class PlacementUtils {
    public void insertCoursePlacement(Flowsheet flowsheet, long courseId, Placement placement) {
        if (placement == null) return;
        shiftPositions(flowsheet, placement, +1);
        flowsheet.getPlacements().put(courseId, placement);
    }

    public void deleteCoursePlacement(Flowsheet flowsheet, long courseId, Placement placement) {
        if (placement == null) return;
        flowsheet.getPlacements().remove(courseId);
        shiftPositions(flowsheet, placement, -1);
    }

    public int comparePlacement(Placement p1, Placement p2) {
        if (p1.getYear() != p2.getYear()) {
            return Integer.compare(p1.getYear(), p2.getYear());
        }
        return Integer.compare(p1.getSemester(), p2.getSemester());
    }

    private void shiftPositions(Flowsheet flowsheet, Placement placement, int delta) {
        flowsheet.getPlacements().values()
                .stream()
                .filter(p ->
                        p.getYear() == placement.getYear() &&
                                p.getSemester() == placement.getSemester() &&
                                p.getPosition() >= placement.getPosition()
                )
                .forEach(p -> p.setPosition(p.getPosition() + delta));
    }
}
