import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { useTermContext } from '@/features/flowsheet/contexts/term-context';

export const useTerm = () => {
  const { state } = useFlowsheetGridContext();
  const { term } = useTermContext();

  return getTermState({ state, term });
};
