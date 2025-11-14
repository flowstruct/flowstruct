import React from 'react';
import type { Placement } from '../domain/flowsheet';

type FlowsheetGridContextValues = {
  selectedPlacements: Set<string>;
  toggleSelectedPlacement: (placementId: string) => void;
  isSelectedPlacement: (placementId: string) => boolean;
  clearSelectedPlacements: () => void;
  onCourseSelectionChange: (selection: Set<string>) => void;
  validateTerms: (placementId: string) => void;
  validTerms: Set<number>;
  focusedPlacement: string | null;
  toggleFocusPlacement: (placementId: string) => void;
  isFocusedPlacement: (placementId: string) => boolean;
  clearFocusedPlacement: () => void;
  movePlacementHandlers: {
    onMoveStart: (placement: Placement) => void;
    onMoveEnd: () => void;
    onMoveOverTerm: (termId: string) => void;
  };
  movingPlacement: Placement | null;
  movedOverTerm: string | null;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const [focusedPlacement, setFocusedPlacement] = React.useState<string | null>(null);
  const [selectedPlacements, setSelectedPlacements] = React.useState<Set<string>>(new Set());
  const [validTerms, setValidTerms] = React.useState<Set<number>>(new Set());
  const [movingPlacement, setMovingPlacement] = React.useState<Placement | null>(null);
  const [movedOverTerm, setMovedOverTerm] = React.useState<string | null>(null);
  const toggleFocusPlacement = (placementId: string) => {
    if (placementId === focusedPlacement) {
      setFocusedPlacement(null);
      return;
    }

    setFocusedPlacement(placementId);
  };

  const isFocusedPlacement = (placementId: string) => placementId === focusedPlacement;

  const clearFocusedPlacement = () => setFocusedPlacement(null);

  const toggleSelectedPlacement = (placementId: string) => {
    if (focusedPlacement) {
      setFocusedPlacement(null);
    }

    setSelectedPlacements((prev) => {
      const updated = new Set(prev);

      if (updated.has(placementId)) updated.delete(placementId);
      else updated.add(placementId);

      return updated;
    });
  };

  const onCourseSelectionChange = (selection: Set<string>) => {
    setSelectedPlacements(selection);
  };

  const validateTerms = (placementId: string) => {
    console.log(placementId);
    setValidTerms(new Set());
  };

  const clearSelectedPlacements = () => setSelectedPlacements(new Set());

  const isSelectedPlacement = (placementId: string) => selectedPlacements.has(placementId);

  const movePlacementHandlers = {
    onMoveStart: (placement: Placement) => {
      setMovingPlacement(placement);
    },
    onMoveEnd: () => {
      setMovingPlacement(null);
    },
    onMoveOverTerm: (termId: string) => {
      setMovedOverTerm(termId);
    },
  };

  return (
    <FlowsheetGridContext.Provider
      value={{
        selectedPlacements,
        toggleSelectedPlacement,
        isSelectedPlacement,
        clearSelectedPlacements,
        onCourseSelectionChange,
        validateTerms,
        validTerms,
        focusedPlacement,
        toggleFocusPlacement,
        isFocusedPlacement,
        clearFocusedPlacement,
        movePlacementHandlers,
        movingPlacement,
        movedOverTerm,
      }}
    >
      {children}
    </FlowsheetGridContext.Provider>
  );
}

export const useFlowsheetGrid = () => {
  const context = React.useContext(FlowsheetGridContext);

  if (!context) throw new Error('useFlowsheetGrid must be used within FlowsheetGridProvider.');

  return context;
};
