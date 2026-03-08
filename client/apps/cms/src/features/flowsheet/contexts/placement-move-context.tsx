import React, { useContext } from 'react';

type PlacementMoveContextValues = {
  allowedTerms: Set<number>;
};

const PlacementMoveContext = React.createContext<PlacementMoveContextValues | undefined>(undefined);

type PlacementMoveProviderProps = {
  children: React.ReactNode;
};

export function PlacementMoveProvider({ children }: PlacementMoveProviderProps) {
  return <PlacementMoveContext.Provider value={}>{children}</PlacementMoveContext.Provider>;
}

export const usePlacementMoveContext = () => {
  const context = useContext(PlacementMoveContext);

  if (!context) {
    throw new Error('usePlacementMoveContext must be used within PlacementMoveProvider.');
  }

  return context;
};
