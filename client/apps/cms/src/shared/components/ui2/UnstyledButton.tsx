import { useRef } from 'react';
import { AriaButtonProps, useButton, useFocusRing, useHover } from 'react-aria';

type Props = AriaButtonProps<'button'> & {
  className?: string;
};

export function UnstyledButton(props: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused } = useFocusRing(props);

  return (
    <button
      role="button"
      {...buttonProps}
      {...hoverProps}
      {...focusProps}
      ref={ref}
      className={props.className}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
    >
      {props.children}
    </button>
  );
}
