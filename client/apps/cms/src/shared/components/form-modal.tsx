import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Form } from '@/shared/components/ui/Form';
import { Button } from '@/shared/components/ui/Button';
import { X } from 'lucide-react';
import { handleSubmit } from '@/shared/utils/handle-submit';
import { Divider } from '@/shared/components/ui/divider';
import styles from './form-modal.module.css';

type FormModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  _setIntendedSubmit: (val: boolean) => void;
};

const FormModalContext = React.createContext<FormModalContextValue | undefined>(undefined);

const useFormModalContext = () => {
  const ctx = React.useContext(FormModalContext);
  if (!ctx) throw new Error('Must be used within a FormModal.');
  return ctx;
};

type FormModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: Record<string, any>) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
};

export function FormModal({
  open: controlledOpen,
  onOpenChange,
  onSubmit,
  size = 'xl',
  children,
}: FormModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const intendedSubmitRef = React.useRef(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const open = React.useCallback(() => {
    isControlled ? onOpenChange?.(true) : setInternalOpen(true);
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => {
    isControlled ? onOpenChange?.(false) : setInternalOpen(false);
  }, [isControlled, onOpenChange]);

  const onFormSubmit = handleSubmit((formData) => {
    if (!intendedSubmitRef.current) return;
    intendedSubmitRef.current = false;
    onSubmit(formData);
    close();
  });

  const childArray = React.Children.toArray(children);

  const trigger = childArray.find(
    (child) => React.isValidElement(child) && child.type === FormModalTrigger
  );

  const modalChildren = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === FormModalTrigger)
  );

  return (
    <FormModalContext.Provider
      value={{
        isOpen,
        open,
        close,
        _setIntendedSubmit: (val) => {
          intendedSubmitRef.current = val;
        },
      }}
    >
      {trigger}
      <Modal isOpen={isOpen} onOpenChange={(val) => (val ? open() : close())} size={size}>
        <Form onSubmit={onFormSubmit}>{modalChildren}</Form>
      </Modal>
    </FormModalContext.Provider>
  );
}

type FormModalTriggerProps = {
  children: React.ReactElement;
  triggerProp?: string;
};

export function FormModalTrigger({ children, triggerProp = 'onPress' }: FormModalTriggerProps) {
  const { open } = useFormModalContext();
  return React.cloneElement(children, { [triggerProp]: open });
}

export function FormModalHeader({ children }: { children: React.ReactNode }) {
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

export function FormModalBody({ children }: { children: React.ReactNode }) {
  return <div className={styles.content}>{children}</div>;
}

export function FormModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Divider />
      <section className={styles.footer}>{children}</section>
    </>
  );
}

type FormModalSubmitProps = {
  isPending?: boolean;
  children: React.ReactNode;
};

export function FormModalSubmit({ isPending, children }: FormModalSubmitProps) {
  const { _setIntendedSubmit, close } = useFormModalContext();
  return (
    <Button
      isPending={isPending}
      variant="primary"
      type="submit"
      onPress={() => {
        if (!isPending) close();
        _setIntendedSubmit(true);
      }}
    >
      {children}
    </Button>
  );
}
