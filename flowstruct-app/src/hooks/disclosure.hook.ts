import React, { type Dispatch, type SetStateAction } from 'react';

export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(initial);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close, setIsOpen };
};

export type DisclosureReturnResult = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}