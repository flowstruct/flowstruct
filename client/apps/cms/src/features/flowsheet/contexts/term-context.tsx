import { Term } from '@/features/flowsheet/domain/flowsheet.ts';
import React, { useContext } from 'react';

type TermContextValue = {
  term: Term;
};

const TermContext = React.createContext<TermContextValue | undefined>(undefined);

type TermProviderProps = {
  term: Term;
  children: React.ReactNode;
};

export function TermProvider({ term, children }: TermProviderProps) {
  return <TermContext.Provider value={{ term }}>{children}</TermContext.Provider>;
}

export const useTermContext = () => {
  const context = useContext(TermContext);

  if (!context) {
    throw new Error('useTermContext must be used within TermProvider.');
  }

  return context;
};
