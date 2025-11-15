'use client';
import {
  Modal as RACModal,
  type ModalOverlayProps as RACModalOverlayProps,
} from 'react-aria-components';
import './Modal.css';

interface ModalOverlayProps extends RACModalOverlayProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ size = 'md', ...props }: ModalOverlayProps) {
  return <RACModal data-size={size} {...props} />;
}
