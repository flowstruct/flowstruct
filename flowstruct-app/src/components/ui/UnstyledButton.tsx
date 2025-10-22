import { useRef } from 'react';
import { type AriaButtonProps, useButton, useFocusRing, useHover } from 'react-aria';
import './UnstyledButton.css';
import clsx from 'clsx';

type Props = AriaButtonProps<'button'> & {
  className?: string;
};

export function UnstyledButton(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused } = useFocusRing(props);

  return (
    <div
      role="button"
      {...buttonProps}
      {...hoverProps}
      {...focusProps}
      ref={ref}
      className={clsx(['unstyledButton', props.className])}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
    >
      {props.children}
    </div>
  );
}
