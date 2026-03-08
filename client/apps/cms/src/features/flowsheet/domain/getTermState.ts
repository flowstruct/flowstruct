import { FlowsheetGridState } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { Term } from '@/features/flowsheet/domain/flowsheet';

export type TermState = 'NORMAL' | 'DISABLED';

function getDroppableState({ state, term }: { state: FlowsheetGridState; term: Term }) {
  term.placements;
}

export function getTermState({ state, term }: { state: FlowsheetGridState; term: Term }) {}
