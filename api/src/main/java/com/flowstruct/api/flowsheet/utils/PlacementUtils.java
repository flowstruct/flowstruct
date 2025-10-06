package com.flowstruct.api.flowsheet.utils;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.domain.Placement;
import org.springframework.stereotype.Service;

@Service
public class PlacementUtils {
    public void insertCoursePlacement(Flowsheet flowsheet, Placement placement) {
        if (placement == null) return;
        shiftPositions(flowsheet, placement, +1);
        flowsheet.getPlacements().add(placement);
    }

    public void deleteCoursePlacement(Flowsheet flowsheet, Placement placement) {
        if (placement == null) return;
        flowsheet.getPlacements().remove(placement);
        shiftPositions(flowsheet, placement, -1);
    }

    public int comparePlacement(Placement p1, Placement p2) {
        return Integer.compare(p1.getTerm(), p2.getTerm());
    }

    private void shiftPositions(Flowsheet flowsheet, Placement placement, int delta) {
        flowsheet.getPlacements()
                .stream()
                .filter(p ->
                        p.getTerm() == placement.getTerm() &&
                                p.getPosition() >= placement.getPosition()
                )
                .forEach(p -> p.setPosition(p.getPosition() + delta));
    }
}
