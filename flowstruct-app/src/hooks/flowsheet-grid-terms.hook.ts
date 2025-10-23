import { useFlowsheet } from './flowsheet.hook.tsx';
import React from 'react';
import type { Term } from '../domain/flowsheet.ts';

export const useFlowsheetGridTerms = () => {
  const { flowsheet } = useFlowsheet();
  const [allPossibleTermsCount, setAllPossibleTermsCount] = React.useState<number>(
    Math.max(...flowsheet.terms.map((t) => t.index), 1)
  );

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
