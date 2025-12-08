import { Requisites } from '@/features/flowsheet/contexts/courses-graph-context';
import { FlowsheetGridState } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { classifyRelationship } from '@/features/flowsheet/domain/classifyRelationship';
import { Placement, Term } from '@/features/flowsheet/domain/flowsheet';

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
  term,
  state,
  termAndPlacementByCourse,
  graph,
}: {
  placement: Placement;
  term: Term;
  state: FlowsheetGridState;
  termAndPlacementByCourse: Record<number, { term: Term; placement: Placement }>;
  graph: Map<number, Requisites>;
}): PlacementState {
  if (state.moving) {
    if (state.moving === placement.course) return 'MOVING';

    const allowedMoveTarget = state.allowedTerms.has(term.id);

    if (!allowedMoveTarget) return 'DISABLED';
  }

  if (state.selected.size > 0) {
    const isSelected = state.selected.has(placement.course);

    if (isSelected) return 'SELECTED';

    return 'SELECTABLE';
  }

  if (state.linkSource) {
    const isLinkSource = state.linkSource === placement.course;

    if (isLinkSource) return 'LINK_SOURCE';

    const source = termAndPlacementByCourse[state.linkSource!];
    const target = termAndPlacementByCourse[placement.course];

    if (!source || !target) return 'DISABLED';

    const relation = classifyRelationship(source.placement.course, target.placement.course, graph);

    if (state.linkType === 'PREREQ') {
      if (relation === 'PREREQ') return 'PREREQ_LINK';

      let allowed = true;

      if (source.placement.course === target.placement.course) {
        allowed = false;
      }

      const targetAheadOfSource = source.term.position >= target.term.position;
      const isCyclic = relation === 'POSTREQSEQ';

      if (targetAheadOfSource || isCyclic) {
        allowed = false;
      }

      return allowed ? 'AVAILABLE_LINK' : 'DISABLED';
    }

    if (state.linkType === 'COREQ') {
      if (relation === 'COREQ') return 'COREQ_LINK';

      return 'AVAILABLE_LINK';
    }
  }

  return 'NORMAL';
}
