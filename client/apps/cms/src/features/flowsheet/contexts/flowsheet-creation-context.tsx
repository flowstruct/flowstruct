// @/features/flowsheet/contexts/create-flowsheet-context.tsx
import React, { useContext } from 'react';
import { Key } from 'react-aria-components';
import { Program } from '@/features/program/domain/program.ts';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useNavigate } from '@tanstack/react-router';

type CreateFlowsheetContextValues = {
  programFormIsOpen: boolean;
  openProgramForm: () => void;
  closeProgramForm: () => void;
  openFlowsheet: boolean;
  setOpenFlowsheet: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProgram: {
    key: Key | null;
    displayName: string;
  };
  selectProgram: (program: Program) => void;
  updateProgramSearch: (value: string) => void;
};

const CreateFlowsheetContext = React.createContext<CreateFlowsheetContextValues | undefined>(
  undefined
);

type CreateFlowsheetProviderProps = { children: React.ReactNode };

export function CreateFlowsheetProvider({ children }: CreateFlowsheetProviderProps) {
  const [formsOpen, setFormsOpen] = React.useState<{ flowsheet: boolean; program: boolean }>({
    flowsheet: false,
    program: false,
  });
  const [navigateToFlowsheet, setNavigateToFlowsheet] = React.useState<boolean>(true);


  const navigate = useNavigate();

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  const handleCreateFlowsheet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (formsOpen.program) {
      return;
    }

    let formData = Object.fromEntries(new FormData(e.currentTarget));

    createFlowsheet.mutate(formData, {
      onSuccess: (data) => {
        setFormsOpen({ flowsheet: false, program: false });
        if (navigateToFlowsheet) {
          navigate({ to: '/flowsheets/$flowsheetId', params: { flowsheetId: String(data.id) } });
        }
      },
    });
  };

  return (
    <CreateFlowsheetContext.Provider
      value={{
        programFormIsOpen,
        openProgramForm,
        closeProgramForm,
        openFlowsheet,
        setOpenFlowsheet,
        selectedProgram,
        selectProgram,
        updateProgramSearch,
      }}
    >
      {children}
    </CreateFlowsheetContext.Provider>
  );
}

export const useCreateFlowsheetContext = () => {
  const context = useContext(CreateFlowsheetContext);
  if (!context)
    throw new Error('useCreateFlowsheetContext must be used within CreateFlowsheetProvider.');
  return context;
};
