import { Requisites } from './buildCoursesGraph';
import { FlowsheetGridState } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import {
  classifyRelationship,
  CourseRelation,
} from '@/features/flowsheet/domain/classifyRelationship';
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
  | 'WARN'
  | 'MOVING';

function getMovingState({
  placement,
  term,
  state,
  allowedTerms,
  graph,
}: {
  placement: Placement;
  term: Term;
  state: FlowsheetGridState;
  allowedTerms: Set<number>;
  graph: Map<number, Requisites>;
}): PlacementState | null {
  if (state.current === 'MOVE') {
    if (state.courseId === placement.course) return 'MOVING';

    const relationship = classifyRelationship(state.courseId, placement.course, graph);
    const disallowedRelationships: CourseRelation[] = ['POSTREQSEQ', 'PREREQSEQ', 'PREREQ'];

    if (disallowedRelationships.includes(relationship)) return 'WARN';

    if (!allowedTerms.has(term.id)) return 'DISABLED';
  }

  return null;
}

function getSelectionState({
  placement,
  state,
}: {
  placement: Placement;
  state: FlowsheetGridState;
}): PlacementState | null {
  if (state.current === 'SELECT') {
    if (state.courseIds.has(placement.course)) return 'SELECTED';

    return 'SELECTABLE';
  }

  return null;
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
  if (state.current === 'LINK') {
    if (state.courseId === placement.course) return 'LINK_SOURCE';

    const source = termAndPlacementByCourse[state.courseId];
    const target = termAndPlacementByCourse[placement.course];

    if (!source || !target) return 'DISABLED';

    const relation = classifyRelationship(source.placement.course, target.placement.course, graph);

    if (state.type === 'PREREQ') {
      if (relation === 'PREREQ') return 'PREREQ_LINK';

      const targetBehindSource = source.term.termNumber > target.term.termNumber;
      const isCyclic = relation === 'POSTREQSEQ';
      const sameCourse = source.placement.course === target.placement.course;

      const allowed = targetBehindSource && !isCyclic && !sameCourse;

      return allowed ? 'AVAILABLE_LINK' : 'DISABLED';
    }

    if (state.type === 'COREQ') {
      if (relation === 'COREQ') return 'COREQ_LINK';

      return 'AVAILABLE_LINK';
    }
  }

  return null;
}

export function getPlacementState({
  placement,
  term,
  state,
  allowedTerms,
  termAndPlacementByCourse,
  graph,
}: {
  placement: Placement;
  term: Term;
  state: FlowsheetGridState;
  allowedTerms: Set<number>;
  termAndPlacementByCourse: Record<number, { term: Term; placement: Placement }>;
  graph: Map<number, Requisites>;
}): PlacementState {
  return (
    getMovingState({ placement, term, state, allowedTerms, graph }) ??
    getSelectionState({ placement, state }) ??
    getLinkState({ placement, state, termAndPlacementByCourse, graph }) ??
    'NORMAL'
  );
}
