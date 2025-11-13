import React from 'react';
import { useDraggableItem, useGridListItem, type DraggableItemResult } from 'react-aria';
import type { DraggableCollectionState, Node } from 'react-stately';
import type { Placement } from '../domain/flowsheet';

type PlacementItemContextValues = {
  draggableItem: DraggableItemResult;
  placement: Placement;
};

const PlacementItemContext = React.createContext<PlacementItemContextValues | undefined>(undefined);

type PlacementItemProviderProps<Placement> = {
  children: React.ReactNode;
  item: Node<Placement>;
  dragState: DraggableCollectionState;
};

export function PlacementItemProvider({
  children,
  item,
  dragState,
}: PlacementItemProviderProps<Placement>) {
  const draggableItem = useDraggableItem({ key: item.key }, dragState);
  const placement = item.value!;

  return (
    <PlacementItemContext.Provider value={{ draggableItem, placement }}>
      {children}
    </PlacementItemContext.Provider>
  );
}

export const usePlacementItem = () => {
  const context = React.useContext(PlacementItemContext);

  if (!context) throw new Error('usePlacement must be used within PlacementProvider.');

  return context;
};
