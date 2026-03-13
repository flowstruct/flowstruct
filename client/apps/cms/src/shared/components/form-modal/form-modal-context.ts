import React from 'react';

export type FormModalContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isPending: boolean;
  onSubmit: (data: Record<string, any>) => Promise<{ id: number }> | void;
  onSuccessRef: React.RefObject<((result: { id: number }) => void) | null>;
  registerOnSuccess: (fn: (result: { id: number }) => void) => void;
};

export const FormModalContext = React.createContext<FormModalContextValue | undefined>(undefined);

export const useFormModalContext = () => {
  const context = React.useContext(FormModalContext);
  if (!context) {
    throw new Error('useFormModalContext must be used within a FormModal.');
  }
  return context;
};
