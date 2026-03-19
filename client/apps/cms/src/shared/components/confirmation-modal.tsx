import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import styles from './confirmation-modal.module.css';

type ConfirmationModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ConfirmationModalContext = React.createContext<ConfirmationModalContextValue | undefined>(
  undefined
);

const useConfirmationModalContext = () => {
  const ctx = React.useContext(ConfirmationModalContext);
  if (!ctx) throw new Error('Must be used within a ConfirmationModal.');
  return ctx;
};

type ConfirmationModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  header: string;
  text: string;
  onConfirm: () => void;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
  cancelLabel?: string;
  children?: React.ReactNode;
};

export function ConfirmationModal({
  open: controlledOpen,
  onOpenChange,
  header,
  text,
  onConfirm,
  submitLabel = 'Confirm',
  submitIcon,
  cancelLabel = 'Cancel',
  children,
}: ConfirmationModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const open = React.useCallback(() => {
    isControlled ? onOpenChange?.(true) : setInternalOpen(true);
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => {
    isControlled ? onOpenChange?.(false) : setInternalOpen(false);
  }, [isControlled, onOpenChange]);

  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (child) => React.isValidElement(child) && child.type === ConfirmationModalTrigger
  );

  return (
    <ConfirmationModalContext.Provider value={{ isOpen, open, close }}>
      {trigger}
      <Modal isOpen={isOpen} onOpenChange={(val) => (val ? open() : close())} size="sm">
        <div className={styles.content}>
          <h2 className={styles.header}>{header}</h2>
          <p className={styles.text}>{text}</p>
          <div className={styles.footer}>
            <Button variant="flat" size="sm" onPress={close}>
              {cancelLabel}
            </Button>
            <Button variant="primary" size="sm" onPress={handleConfirm}>
              {submitIcon} {submitLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </ConfirmationModalContext.Provider>
  );

  function handleConfirm() {
    onConfirm();
    close();
  }
}

type ConfirmationModalTriggerProps = {
  children: React.ReactElement;
  triggerProp?: string;
};

export function ConfirmationModalTrigger({
  children,
  triggerProp = 'onPress',
}: ConfirmationModalTriggerProps) {
  const { open } = useConfirmationModalContext();
  return React.cloneElement(children, { [triggerProp]: open });
}
