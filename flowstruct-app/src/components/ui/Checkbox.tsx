'use client';
import { Checkbox as AriaCheckbox, type CheckboxProps } from 'react-aria-components';

import './Checkbox.css';
import React from 'react';

export function Checkbox({
  children,
  variant = 'square',
  ...props
}: Omit<CheckboxProps, 'children'> & {
  children?: React.ReactNode;
  variant?: 'circle' | 'square';
}) {
  return (
    <AriaCheckbox {...props}>
      {({ isIndeterminate }) => (
        <>
          <div className="checkbox" data-variant={variant}>
            <svg viewBox="0 0 18 18" aria-hidden="true">
              {isIndeterminate ? (
                <rect x={1} y={7.5} width={15} height={3} />
              ) : variant === 'square' ? (
                <polyline points="1 9 7 14 15 4" />
              ) : (
                <circle cx="9" cy="9" r="2" />
              )}
            </svg>
          </div>
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}
