import type { Placement } from "../domain/flowsheet";
import { getPlacementState } from "../domain/placement";
import { useCoursesGraph } from "./courses-graph.hook";
import { useFlowsheetGrid } from "./flowsheet-grid.hook";
import { usePlacements } from "./placements.hook";
import { useTerms } from "./terms.hook";

export function usePlacement(placement: Placement) {
  const { placements } = usePlacements();
  const { state } = useFlowsheetGrid();
  const { coursesGraph: graph } = useCoursesGraph();
  const { terms } = useTerms();

  return getPlacementState({
    placement,
    state,
    placements,
    terms,
    graph
  });
}
