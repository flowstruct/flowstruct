import { UserProfile } from '@/shared/components/app-shell/sidebar/user-profile.tsx';
import styles from './index.module.css';
import { useFocusRing, useHover, usePress } from 'react-aria';
import { useRef } from 'react';

function SidebarMenuItem(props) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { pressProps, isPressed } = usePress(props);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused } = useFocusRing(props);

  return (
    <button
      ref={ref}
      {...pressProps}
      {...hoverProps}
      {...focusProps}
      {...props}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
    ></button>
  );
}

function SidebarMenu() {}

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <UserProfile />
    </aside>
  );
}
