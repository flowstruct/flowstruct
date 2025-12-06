package com.flowstruct.api.flowsheet.utils;

import com.flowstruct.api.flowsheet.domain.Placement;
import com.flowstruct.api.flowsheet.domain.Term;
import org.springframework.stereotype.Service;

@Service
public class PlacementUtils {

  public void insertCoursePlacement(Term term, Placement placement) {
    if (placement == null || term == null)
      return;

    shiftPositions(term, placement.getPosition(), +1);

    term.getPlacements().add(placement);
  }

  public void deleteCoursePlacement(Term term, Placement placement) {
    if (placement == null || term == null)
      return;

    term.getPlacements().remove(placement);

    shiftPositions(term, placement.getPosition(), -1);
  }

  public int compareTerms(Term t1, Term t2) {
    int yearComparison = Integer.compare(t1.getYear(), t2.getYear());

    if (yearComparison != 0) {
      return yearComparison;
    }

    return Integer.compare(t1.getPosition(), t2.getPosition());
  }

  private void shiftPositions(Term term, int fromPosition, int delta) {
    term.getPlacements()
        .stream()
        .filter(p -> p.getPosition() >= fromPosition)
        .forEach(p -> p.setPosition(p.getPosition() + delta));
  }
}
