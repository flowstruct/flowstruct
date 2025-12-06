import React from "react";

export type LinkType = 'PREREQ' | 'COREQ';

export type FlowsheetGridState = {
  selected: Set<number>;
  focused: number | null;
  moving: number | null;
  linkSource: number | null;
  linkType: LinkType | null;
  allowedTerms: Set<number>;
};

type FlowsheetGridAction =
  | { type: "TOGGLE_SELECT"; payload: { courseId: number } }
  | { type: "CLEAR_SELECTED" }
  | { type: "TOGGLE_FOCUS"; payload: { courseId: number } }
  | { type: "TOGGLE_LINKING"; payload: { courseId: number, type: LinkType | null } }
  | { type: "MOVE_START"; payload: { courseId: number, allowedTerms: Set<number> } }
  | { type: "MOVE_END"; }
  | { type: "RESET_STATE" };

const initialState: FlowsheetGridState = {
  selected: new Set(),
  focused: null,
  moving: null,
  linkSource: null,
  linkType: null,
  allowedTerms: new Set()
};

function reducer(state: FlowsheetGridState, action: FlowsheetGridAction): FlowsheetGridState {
  switch (action.type) {
    case "TOGGLE_SELECT": {
      const id = action.payload.courseId;
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
      const id = action.payload.courseId;

      return {
        ...state,
        focused: state.focused === id ? null : id,
      };
    }

    case "TOGGLE_LINKING": {
      const id = action.payload.courseId;
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
      const id = action.payload.courseId;
      const allowedTerms = action.payload.allowedTerms;

      return {
        ...initialState,
        moving: id,
        allowedTerms
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

export function useFlowsheetGridContext() {
  const context = React.useContext(FlowsheetGridContext);

  if (!context) throw new Error("useFlowsheetGridContext must be used inside provider");

  return context;
}
