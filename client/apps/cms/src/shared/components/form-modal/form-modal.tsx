import React from 'react';
import { FormModalContext, FormModalContextValue, useFormModalContext } from './form-modal-context';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { Modal } from '@/shared/components/ui/Modal';
import { Form } from '@/shared/components/ui/Form';
import { Button } from '@/shared/components/ui/Button';
import { X } from 'lucide-react';
import { handleSubmit } from '@/shared/utils/handle-submit';
import { Divider } from '@/shared/components/ui/divider';
import styles from './form-modal.module.css';

type FormModalProps = {
  onSubmit: (data: Record<string, any>) => Promise<{ id: number }> | void;
  isPending: boolean;
  children: React.ReactNode;
};

export function FormModal({ onSubmit, isPending, children }: FormModalProps) {
  const modalState = useDisclosure();
  const onSuccessRef = React.useRef<((result: { id: number }) => void) | null>(null);

  const registerOnSuccess = React.useCallback((fn: (result: { id: number }) => void) => {
    onSuccessRef.current = fn;
  }, []);

  const value: FormModalContextValue = React.useMemo(
    () => ({
      open: modalState.open,
      close: modalState.close,
      isOpen: modalState.isOpen,
      setIsOpen: modalState.setIsOpen,
      isPending,
      onSubmit,
      onSuccessRef,
      registerOnSuccess,
    }),
    [
      modalState.open,
      modalState.close,
      modalState.isOpen,
      modalState.setIsOpen,
      isPending,
      onSubmit,
      registerOnSuccess,
    ]
  );

  return <FormModalContext.Provider value={value}>{children}</FormModalContext.Provider>;
}

type FormModalContentProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export function FormModalContent({ children, size = 'xl' }: FormModalContentProps) {
  const { isOpen, setIsOpen, onSubmit, close, onSuccessRef } = useFormModalContext();

  const onFormSubmit = handleSubmit(async (formData) => {
    const result = await onSubmit(formData);

    if (!result) return;

    close();
    onSuccessRef.current?.(result);
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} size={size}>
      <Form onSubmit={onFormSubmit}>{children}</Form>
    </Modal>
  );
}

type FormModalHeaderProps = {
  children: React.ReactNode;
};

export function FormModalHeader({ children }: FormModalHeaderProps) {
  const { close } = useFormModalContext();

  return (
    <header className={styles.header}>
      {children}

      <Button variant="transparent" shape="icon" onPress={close}>
        <X size={14} />
      </Button>
    </header>
  );
}

type FormModalBodyProps = {
  children: React.ReactNode;
};

export function FormModalBody({ children }: FormModalBodyProps) {
  return <div className={styles.content}>{children}</div>;
}

type FormModalFooterProps = {
  children: React.ReactNode;
};

export function FormModalFooter({ children }: FormModalFooterProps) {
  return (
    <>
      <Divider />
      <section className={styles.footer}>{children}</section>
    </>
  );
}

type FormModalSubmitProps = {
  children: React.ReactNode;
};

export function FormModalSubmit({ children }: FormModalSubmitProps) {
  const { isPending } = useFormModalContext();

  return (
    <Button isPending={isPending} variant="primary" type="submit">
      {children}
    </Button>
  );
}
