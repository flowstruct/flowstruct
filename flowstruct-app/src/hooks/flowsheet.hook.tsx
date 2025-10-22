import React, { useContext } from 'react';
import type { Flowsheet } from '../types/flowsheet.types.ts';

type FlowsheetContextValues = {
  flowsheet: Flowsheet;
  saveFlowsheet: (updatedFlowsheet: Flowsheet) => void;
};

const FlowsheetContext = React.createContext<FlowsheetContextValues | undefined>(undefined);

type FlowsheetProviderProps = {
  children: React.ReactNode;
};

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

export function FlowsheetProvider({ children }: FlowsheetProviderProps) {
  const [flowsheet, setFlowsheet] = React.useState<Flowsheet>(emptyFlowsheet);

  const saveFlowsheet = (updatedFlowsheet: Flowsheet) => {
    setFlowsheet({
      id: crypto.randomUUID(),
      program: 'Untitled',
      year: new Date().getFullYear(),
      name: '',
      sections: [],
      terms: [{ index: 1, placements: [{ type: 'COURSE' as const, course: 'yes', span: 1 }] }],
      courses: {['yes']: {
          id: 'yes',
          code: '',
          name: 'yeah',
          creditHours: 0,
          ects: 0,
          lectureHours: 0,
          practicalHours: 0,
          type: 'F2F',
          prerequisites: [],
          corequisites: [],
        }},
    });
    // saveToStorage(STORAGE_KEY, updatedFlowsheet);
  };

  return (
    <FlowsheetContext.Provider
      value={{
        flowsheet,
        saveFlowsheet,
      }}
    >
      {children}
    </FlowsheetContext.Provider>
  );
}

export const useFlowsheet = () => {
  const context = useContext(FlowsheetContext);

  if (!context) throw new Error('useFlowsheet must be used within FlowsheetProvider.');

  return context;
};
