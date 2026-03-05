import { Term, TERM_NAMES } from '@/features/flowsheet/domain/flowsheet';

export const getTermDisplayName = (term: Pick<Term, 'termNumber' | 'name'>): string =>
  term.name || TERM_NAMES[(term.termNumber - 1) % TERM_NAMES.length];
