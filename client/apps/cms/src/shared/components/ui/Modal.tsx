'use client';
import {
  Modal as RACModal,
  ModalOverlayProps as RACModalOverlayProps,
} from 'react-aria-components';
import './Modal.css';

interface ModalOverlayProps extends RACModalOverlayProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ size = 'md', ...props }: ModalOverlayProps) {
  return <RACModal data-size={size} {...props} />;
}
