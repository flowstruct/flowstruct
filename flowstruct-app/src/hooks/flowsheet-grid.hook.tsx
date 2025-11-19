import React from 'react';
import type { Placement } from '../domain/flowsheet';

type FlowsheetGridContextValues = {
  selectedPlacements: Set<string>;
  toggleSelectedPlacement: (placementId: string) => void;
  isSelectedPlacement: (placementId: string) => boolean;
  clearSelectedPlacements: () => void;
  onCourseSelectionChange: (selection: Set<string>) => void;
  focusedPlacement: Placement | null;
  toggleFocusPlacement: (placement: Placement) => void;
  isFocusedPlacement: (placementId: string) => boolean;
  clearFocusedPlacement: () => void;
  toggleLinkingMode: (placement: Placement) => void;
  selectedPrerequisites: Set<string>;
  linkingMode: boolean;
  toggleSelectPrerequisite: (prerequisiteId: string) => void;
  clearLinkingMode: () => void;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

type FlowsheetGridProviderProps = {
  children: React.ReactNode;
};

export function FlowsheetGridProvider({ children }: FlowsheetGridProviderProps) {
  const [focusedPlacement, setFocusedPlacement] = React.useState<Placement | null>(null);
  const [selectedPlacements, setSelectedPlacements] = React.useState<Set<string>>(new Set());
  const [selectedPrerequisites, setSelectedPrerequisites] = React.useState<Set<string>>(new Set());
  const [linkingMode, setLinkingMode] = React.useState<boolean>(false);

  const toggleFocusPlacement = (placement: Placement) => {
    if (placement.id === focusedPlacement?.id) {
      setFocusedPlacement(null);
      return;
    }

    setFocusedPlacement(placement);
  };

  const toggleSelectPrerequisite = (prerequisiteId: string) => {
    setSelectedPrerequisites((prev) => {
      const updated = new Set(prev);

      if (updated.has(prerequisiteId)) {
        updated.delete(prerequisiteId);

        return updated;
      }

      updated.add(prerequisiteId);

      return updated;
    });
  };

  const toggleLinkingMode = (placement: Placement) => {
    if (linkingMode) {
      setFocusedPlacement(null);
      setLinkingMode(false);
      return;
    }

    setLinkingMode(true);
    setFocusedPlacement(placement);
    setSelectedPlacements(new Set());
  };

  const isFocusedPlacement = (placementId: string) => placementId === focusedPlacement?.id;

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

  const clearSelectedPlacements = () => setSelectedPlacements(new Set());

  const isSelectedPlacement = (placementId: string) => selectedPlacements.has(placementId);

  const clearLinkingMode = () => setLinkingMode(false);

  return (
    <FlowsheetGridContext.Provider
      value={{
        selectedPlacements,
        toggleSelectedPlacement,
        isSelectedPlacement,
        clearSelectedPlacements,
        onCourseSelectionChange,
        focusedPlacement,
        toggleFocusPlacement,
        isFocusedPlacement,
        clearFocusedPlacement,
        toggleLinkingMode,
        toggleSelectPrerequisite,
        linkingMode,
        clearLinkingMode,
        selectedPrerequisites,
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
