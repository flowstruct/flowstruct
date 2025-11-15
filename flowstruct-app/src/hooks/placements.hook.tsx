import React, { useContext } from 'react';
import type { Placement } from '../domain/flowsheet.ts';
import { useLocalStorage } from './local-storage.hook.ts';

type PlacementsContextValues = {
  placements: Placement[];
  setPlacements: (newValue: Placement[] | ((prev: Placement[]) => Placement[])) => void;
};

const PlacementsContext = React.createContext<PlacementsContextValues | undefined>(undefined);

const STORAGE_KEY = 'placements';

type PlacementsProviderProps = {
  children: React.ReactNode;
};

export function PlacementsProvider({ children }: PlacementsProviderProps) {
  const [placements, setPlacements] = useLocalStorage<Placement[]>(STORAGE_KEY, []);

  return (
    <PlacementsContext.Provider value={{ placements, setPlacements }}>
      {children}
    </PlacementsContext.Provider>
  );
}

export const usePlacements = () => {
  const context = useContext(PlacementsContext);

  if (!context) throw new Error('useFlowsheet must be used within FlowsheetProvider.');

  return context;
};
