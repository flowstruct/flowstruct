import { Requisites } from './buildCoursesGraph';
import { FlowsheetGridState } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { classifyRelationship } from '@/features/flowsheet/domain/classifyRelationship';
import { Placement, Term } from '@/features/flowsheet/domain/flowsheet';

export type PlacementState =
  | 'NORMAL'
  | 'SELECTED'
  | 'SELECTABLE'
  | 'LINK_SOURCE'
  | 'PREREQ_LINK'
  | 'COREQ_LINK'
  | 'AVAILABLE_LINK'
  | 'DISABLED'
  | 'MOVING';

function getMovingState({
  placement,
  term,
  state,
}: {
  placement: Placement;
  term: Term;
  state: FlowsheetGridState;
}): PlacementState | null {
  if (!state.moving) return null;

  if (state.moving === placement.course) return 'MOVING';

  if (!state.allowedTerms.has(term.id)) return 'DISABLED';

  return null;
}

function getSelectionState({
  placement,
  state,
}: {
  placement: Placement;
  state: FlowsheetGridState;
}): PlacementState | null {
  if (state.selected.size === 0) return null;

  if (state.selected.has(placement.course)) return 'SELECTED';

  return 'SELECTABLE';
}

function getLinkState({
  placement,
  state,
  termAndPlacementByCourse,
  graph,
}: {
  placement: Placement;
  state: FlowsheetGridState;
  termAndPlacementByCourse: Record<number, { term: Term; placement: Placement }>;
  graph: Map<number, Requisites>;
}): PlacementState | null {
  const linkSourceId = state.linkSource;

  if (!linkSourceId) return null;

  if (linkSourceId === placement.course) return 'LINK_SOURCE';

  const source = termAndPlacementByCourse[linkSourceId];
  const target = termAndPlacementByCourse[placement.course];

  if (!source || !target) return 'DISABLED';

  const relation = classifyRelationship(source.placement.course, target.placement.course, graph);

  if (state.linkType === 'PREREQ') {
    if (relation === 'PREREQ') return 'PREREQ_LINK';

    const targetBehindSource = source.term.termNumber > target.term.termNumber;
    const isCyclic = relation === 'POSTREQSEQ';
    const sameCourse = source.placement.course === target.placement.course;

    const allowed = targetBehindSource && !isCyclic && !sameCourse;

    return allowed ? 'AVAILABLE_LINK' : 'DISABLED';
  }

  if (state.linkType === 'COREQ') {
    if (relation === 'COREQ') return 'COREQ_LINK';

    return 'AVAILABLE_LINK';
  }

  return null;
}

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
  return (
    getMovingState({ placement, term, state }) ??
    getSelectionState({ placement, state }) ??
    getLinkState({ placement, state, termAndPlacementByCourse, graph }) ??
    'NORMAL'
  );
}
