import { TagIcon, Trash, X } from 'lucide-react';
import React from 'react';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Divider } from '../ui/divider.tsx';
import { Popover } from '../ui/Popover.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import styles from './multi-select-toolbar.module.css';
import { deletePlacements } from '../../domain/placement.ts';
import { usePlacements } from '../../hooks/placements.hook.tsx';
import { useCourses } from '../../hooks/courses.hook.tsx';

export function MultiSelectToolbar() {
  const { selectedPlacements, focusedPlacement, clearSelectedPlacements, clearFocusedPlacement } =
    useFlowsheetGrid();

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

  const { courses, setCourses } = useCourses();

  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  const handleDeletePlacements = () => {
    const deletePlacementsResult = deletePlacements({
      courses,
      placements,
      placementIds: Array.from(selectedPlacements),
    });

    if (focusedPlacement && selectedPlacements.has(focusedPlacement.id)) {
      clearFocusedPlacement();
    }

    clearSelectedPlacements();
    setPlacements(deletePlacementsResult.placements);
    setCourses(deletePlacementsResult.courses);
  };

  return (
    <div className={styles.wrapper} ref={triggerRef}>
      <Popover
        triggerRef={triggerRef}
        isNonModal
        isOpen={selectedPlacements.size > 0}
        className={styles.toolbar}
      >
        <Group gap={3}>
          <div className={styles.selectionCounter}>
            <Group>
              <p>{selectedPlacements.size} selected</p>

              <Button
                variant="ghost"
                shape="icon"
                size="none"
                onPress={() => clearSelectedPlacements()}
              >
                <X size={14} />
              </Button>
            </Group>
          </div>

          <Divider orientation="vertical" />

          <Group>
            <TooltipTrigger>
              <Button shape="icon" variant="flat" size="sm">
                <TagIcon size={14} />
              </Button>

              <Tooltip>Tag section</Tooltip>
            </TooltipTrigger>

            <TooltipTrigger>
              <Button shape="icon" size="sm" variant="flat" onPress={handleDeletePlacements}>
                <Trash color="red" size={14} />
              </Button>

              <Tooltip>Remove courses</Tooltip>
            </TooltipTrigger>
          </Group>
        </Group>
      </Popover>
    </div>
  );
}
