import { Requisites } from "@/features/flowsheet/contexts/courses-graph-context";
import { FlowsheetGridState } from "@/features/flowsheet/contexts/flowsheet-grid-context";
import { classifyRelationship } from "@/features/flowsheet/domain/classifyRelationship";
import { Placement, Term } from "@/features/flowsheet/domain/flowsheet";
import { validatePrerequisite } from "@/features/flowsheet/domain/validatePrerequisite";

export type PlacementState =
  | 'NORMAL'
  | 'FOCUSED'
  | 'SELECTED'
  | 'SELECTABLE'
  | 'LINK_SOURCE'
  | 'PREREQ_LINK'
  | 'COREQ_LINK'
  | 'AVAILABLE_LINK'
  | 'DISABLED'
  | 'MOVING';

export function getPlacementState({
  placement,
  state,
  placements,
  terms,
  graph,
}: {
  placement: Placement;
  state: FlowsheetGridState;
  placements: Record<number, Placement>;
  terms: Record<number, Term>;
  graph: Map<number, Requisites>;
}): PlacementState {
  if (state.moving) {
    if (state.moving === placement.item) return 'MOVING';

    const allowedMoveTarget = state.allowedTerms.has(placement.term);

    if (!allowedMoveTarget) return 'DISABLED'
  }

  if (state.selected.size > 0) {
    const isSelected = state.selected.has(placement.item);

    if (isSelected) return 'SELECTED';

    return 'SELECTABLE';
  }

  if (state.linkSource) {
    const isLinkSource = state.linkSource === placement.item;

    if (isLinkSource) return 'LINK_SOURCE';

    const source = placements[state.linkSource!];
    const target = placements[placement.item];

    if (!source || !target) return 'DISABLED';

    const relation = classifyRelationship(source.item, target.item, graph);

    if (state.linkType === 'PREREQ') {
      if (relation === 'PREREQ') return 'PREREQ_LINK';

      const allowed = validatePrerequisite(source, target, terms, relation);

      return allowed ? 'AVAILABLE_LINK' : 'DISABLED';
    }

    if (state.linkType === 'COREQ') {
      if (relation === 'COREQ') return 'COREQ_LINK';

      return 'AVAILABLE_LINK';
    }
  }

  return 'NORMAL';
}
