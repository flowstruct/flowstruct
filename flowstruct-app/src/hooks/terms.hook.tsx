import React, { useContext } from 'react';
import type { Term } from '../domain/flowsheet.ts';
import { useLocalStorage } from './local-storage.hook.ts';

type TermsContextValues = {
  terms: Record<string, Term>;
  setTerms: (
    newValue: Record<string, Term> | ((prev: Record<string, Term>) => Record<string, Term>)
  ) => void;
};

const TermsContext = React.createContext<TermsContextValues | undefined>(undefined);

const STORAGE_KEY = 'terms';

type TermsProviderProps = {
  children: React.ReactNode;
};

const emptyTerms = (): Record<string, Term> => {
  const terms: Record<string, Term> = {};

  const id = crypto.randomUUID();
  terms[id] = { id, name: 'Untitled term', position: 1 };

  return terms;
};

export function TermsProvider({ children }: TermsProviderProps) {
  const [terms, setTerms] = useLocalStorage<Record<string, Term>>(STORAGE_KEY, emptyTerms());

  return <TermsContext.Provider value={{ terms, setTerms }}>{children}</TermsContext.Provider>;
}

export const useTerms = () => {
  const context = useContext(TermsContext);

  if (!context) throw new Error('useFlowsheet must be used within FlowsheetProvider.');

  return context;
};
