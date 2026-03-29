import React from 'react';

export type LinkType = 'PREREQ' | 'COREQ';

type IDLE = {
  current: 'IDLE';
};
type SELECT = {
  current: 'SELECT';
  courseIds: Set<number>;
};
type MOVE = {
  current: 'MOVE';
  courseId: number;
};
type LINK = {
  current: 'LINK';
  courseId: number;
  type: LinkType;
};
export type FlowsheetGridState = IDLE | SELECT | MOVE | LINK;

type Action =
  | { type: 'SELECT'; courseId: number; remember?: boolean }
  | { type: 'MOVE'; courseId: number; remember?: boolean }
  | { type: 'LINK'; courseId: number; linkType: LinkType; remember?: boolean }
  | { type: 'STOP' }
  | { type: 'RESET' };

type ReducerState = {
  current: FlowsheetGridState;
  previous: FlowsheetGridState;
};

const IDLE_STATE: IDLE = { current: 'IDLE' };

function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'SELECT': {
      if (state.current.current === 'SELECT') {
        const nextSet = new Set(state.current.courseIds);

        nextSet.has(action.courseId)
          ? nextSet.delete(action.courseId)
          : nextSet.add(action.courseId);

        if (nextSet.size === 0) {
          return { current: IDLE_STATE, previous: IDLE_STATE };
        }

        return {
          current: { current: 'SELECT', courseIds: nextSet },
          previous: state.previous,
        };
      }

      return {
        current: { current: 'SELECT', courseIds: new Set([action.courseId]) },
        previous: state.current,
      };
    }
    case 'MOVE':
      return {
        current: { current: 'MOVE', courseId: action.courseId },
        previous: state.current,
      };
    case 'LINK':
      return {
        current: { current: 'LINK', courseId: action.courseId, type: action.linkType },
        previous: state.current,
      };
    case 'STOP':
      return {
        current: state.previous,
        previous: IDLE_STATE,
      };
    case 'RESET':
      return {
        current: IDLE_STATE,
        previous: IDLE_STATE,
      };
    default:
      return state;
  }
}

type FlowsheetGridContextValues = {
  state: FlowsheetGridState;
  dispatch: React.Dispatch<Action>;
};

const FlowsheetGridContext = React.createContext<FlowsheetGridContextValues | undefined>(undefined);

export function FlowsheetGridProvider({ children }: { children: React.ReactNode }) {
  const [{ current }, dispatch] = React.useReducer(reducer, {
    current: IDLE_STATE,
    previous: IDLE_STATE,
  });

  return (
    <FlowsheetGridContext.Provider value={{ state: current, dispatch }}>
      {children}
    </FlowsheetGridContext.Provider>
  );
}

export function useFlowsheetGridContext() {
  const context = React.useContext(FlowsheetGridContext);
  if (!context) throw new Error('useFlowsheetGridContext must be used inside provider');
  return context;
}
