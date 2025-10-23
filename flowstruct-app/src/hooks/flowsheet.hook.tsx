import React, { useContext } from 'react';
import type { Flowsheet } from '../domain/flowsheet.ts';
import { useLocalStorage } from './local-storage.hook.ts';

type FlowsheetContextValues = {
  flowsheet: Flowsheet;
  setFlowsheet: (newValue: Flowsheet | ((prev: Flowsheet) => Flowsheet)) => void;
};

const FlowsheetContext = React.createContext<FlowsheetContextValues | undefined>(undefined);

const STORAGE_KEY = 'flowstruct';

const emptyFlowsheet: Flowsheet = {
  id: crypto.randomUUID(),
  program: 'Untitled',
  year: new Date().getFullYear(),
  name: '',
  sections: [],
  terms: [],
  courses: {},
};

type FlowsheetProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetProvider({ children }: FlowsheetProviderProps) {
  const [flowsheet, setFlowsheet] = useLocalStorage(STORAGE_KEY, emptyFlowsheet);

  return (
    <FlowsheetContext.Provider value={{ flowsheet, setFlowsheet }}>
      {children}
    </FlowsheetContext.Provider>
  );
}

export const useFlowsheet = () => {
  const context = useContext(FlowsheetContext);

  if (!context) throw new Error('useFlowsheet must be used within FlowsheetProvider.');

  return context;
};
