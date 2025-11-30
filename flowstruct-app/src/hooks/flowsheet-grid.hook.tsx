import React from "react";

export type FlowsheetGridState = {
  selected: Set<string>;
  focused: string | null;
  linkSource: string | null;
};

type FlowsheetGridAction =
  | { type: "TOGGLE_SELECT"; placementId: string }
  | { type: "CLEAR_SELECTED" }
  | { type: "TOGGLE_FOCUS"; placementId: string }
  | { type: "TOGGLE_LINKING"; placementId: string };

const initialState: FlowsheetGridState = {
  selected: new Set(),
  focused: null,
  linkSource: null,
};

function reducer(state: FlowsheetGridState, action: FlowsheetGridAction): FlowsheetGridState {
  switch (action.type) {
    case "TOGGLE_SELECT": {
      const next = new Set(state.selected);
      if (next.has(action.placementId)) next.delete(action.placementId);
      else next.add(action.placementId);
      return { ...state, selected: next, focused: null, linkSource: null };
    }

    case "CLEAR_SELECTED":
      return { ...state, selected: new Set() };

    case "TOGGLE_FOCUS":
      return {
        ...state,
        focused: state.focused === action.placementId ? null : action.placementId,
      };

    case "TOGGLE_LINKING":
      return {
        ...state,
        linkSource: state.linking ? null : action.placementId,
        focused: state.linking ? null : action.placementId,
        selected: new Set(),
      };

    default:
      return state;
  }
}

const FlowsheetGridContext = React.createContext<any>(undefined);

export function FlowsheetGridProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <FlowsheetGridContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowsheetGridContext.Provider>
  );
}

export function useFlowsheetGrid() {
  const ctx = React.useContext(FlowsheetGridContext);
  if (!ctx) throw new Error("useFlowsheetGrid must be used inside provider");
  return ctx;
}
