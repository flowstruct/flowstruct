import { useFlowsheet } from './flowsheet.hook.tsx';
import React from 'react';
import type { Term } from '../domain/flowsheet.ts';

export const useFlowsheetGridTerms = () => {
  const { flowsheet } = useFlowsheet();

  const lastNonEmptyIndex = Math.max(
    ...flowsheet.terms.filter((term) => term.placements.length > 0).map((term) => term.index),
    1
  );

  const [allPossibleTermsCount, setAllPossibleTermsCount] =
    React.useState<number>(lastNonEmptyIndex);

  const terms = React.useMemo(() => {
    const existingTerms = Object.fromEntries(
      flowsheet.terms.map((term) => [term.index, term.placements])
    );
    const allPossibleTerms: Term[] = [];

    for (let i = 1; i <= allPossibleTermsCount; i++) {
      allPossibleTerms.push({ index: i, placements: existingTerms[i] ?? [] });
    }

    return allPossibleTerms;
  }, [flowsheet, allPossibleTermsCount]);

  const createTerm = () => setAllPossibleTermsCount((prev) => prev + 1);

  return { terms, createTerm };
};
