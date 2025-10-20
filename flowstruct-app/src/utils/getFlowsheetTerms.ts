import type { Flowsheet, Placement, Term } from "../types/flowsheet.types";

export const getFlowsheetTerms = (flowsheet: Flowsheet) => {
  const grouped = Object.groupBy(flowsheet.placements, (p) => p.term);
  if (Object.keys(grouped).length === 0) {
    return { 1: [] } as Record<Term, Placement[]>;
  }
  return grouped as Record<Term, Placement[]>;
};
