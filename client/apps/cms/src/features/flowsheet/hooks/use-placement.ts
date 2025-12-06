import { useFlowsheetCoursesGraphContext } from "@/features/flowsheet/contexts/courses-graph-context";
import { useFlowsheetContext } from "@/features/flowsheet/contexts/flowsheet-context";
import { useFlowsheetGridContext } from "@/features/flowsheet/contexts/flowsheet-grid-context";
import { Placement } from "@/features/flowsheet/domain/flowsheet";
import { getPlacementState } from "@/features/flowsheet/domain/getPlacementState";

export function usePlacement(placement: Placement) {
  const { state } = useFlowsheetGridContext();
  const { flowsheet } = useFlowsheetContext();
  const { coursesGraph } = useFlowsheetCoursesGraphContext();

  return getPlacementState({
    placement,
    state,
    placements: flowsheet.placementsByCourse,
    terms: flowsheet.termsById,
    graph: coursesGraph,
  });
}
