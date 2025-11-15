import React, { useContext } from 'react';
import type { Term } from '../domain/flowsheet.ts';
import { useLocalStorage } from './local-storage.hook.ts';

type TermsContextValues = {
  terms: Term[];
  setTerms: (newValue: Term[] | ((prev: Term[]) => Term[])) => void;
};

const TermsContext = React.createContext<TermsContextValues | undefined>(undefined);

const STORAGE_KEY = 'terms';

type TermsProviderProps = {
  children: React.ReactNode;
};

export function TermsProvider({ children }: TermsProviderProps) {
  const [terms, setTerms] = useLocalStorage<Term[]>(STORAGE_KEY, [
    { id: crypto.randomUUID(), name: 'Untitled term' },
  ]);

  return <TermsContext.Provider value={{ terms, setTerms }}>{children}</TermsContext.Provider>;
}

export const useTerms = () => {
  const context = useContext(TermsContext);

  if (!context) throw new Error('useFlowsheet must be used within FlowsheetProvider.');

  return context;
};
