import React from "react";

export type LinkType = 'PREREQ' | 'COREQ';

export type FlowsheetGridState = {
  selected: Set<string>;
  focused: string | null;
  moving: string | null;
  linkSource: string | null;
  linkType: LinkType | null;
};

type FlowsheetGridAction =
  | { type: "TOGGLE_SELECT"; payload: { placementId: string } }
  | { type: "CLEAR_SELECTED" }
  | { type: "TOGGLE_FOCUS"; payload: { placementId: string } }
  | { type: "TOGGLE_LINKING"; payload: { placementId: string, type: LinkType | null } }
  | { type: "MOVE_START"; payload: { placementId: string } }
  | { type: "MOVE_END"; }
  | { type: "RESET_STATE" };

const initialState: FlowsheetGridState = {
  selected: new Set(),
  focused: null,
  moving: null,
  linkSource: null,
  linkType: null
};

function reducer(state: FlowsheetGridState, action: FlowsheetGridAction): FlowsheetGridState {
  switch (action.type) {
    case "TOGGLE_SELECT": {
      const id = action.payload.placementId;
      const next = new Set(state.selected);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return {
        ...state,
        selected: next,
        focused: null,
        linkSource: null,
      };
    }

    case "CLEAR_SELECTED":
      return { ...state, selected: new Set() };

    case "TOGGLE_FOCUS": {
      const id = action.payload.placementId;

      return {
        ...state,
        focused: state.focused === id ? null : id,
      };
    }

    case "TOGGLE_LINKING": {
      const id = action.payload.placementId;
      const type = action.payload.type;

      return {
        ...state,
        linkType: state.linkSource === id ? null : type,
        linkSource: state.linkSource === id ? null : id,
        focused: null,
        selected: new Set(),
      };
    }

    case "MOVE_START": {
      const id = action.payload.placementId;

      return {
        ...initialState,
        moving: id
      }
    }

    case "MOVE_END": {
      return initialState;
    }

    case "RESET_STATE": {
      return initialState;
    }

    default:
      return state;
  }
}

type FlowsheetGridContextValues = {
  state: FlowsheetGridState;
  dispatch: React.ActionDispatch<[action: FlowsheetGridAction]>
}
const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

export function FlowsheetGridProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <FlowsheetGridContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowsheetGridContext.Provider>
  );
}

export function useFlowsheetGrid() {
  const context = React.useContext(FlowsheetGridContext);

  if (!context) throw new Error("useFlowsheetGrid must be used inside provider");

  return context;
}
