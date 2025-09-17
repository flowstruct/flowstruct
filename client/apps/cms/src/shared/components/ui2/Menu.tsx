import { Button } from './Button.tsx';
import { ChevronRight } from 'lucide-react';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuItemProps,
  MenuProps,
  MenuSection as AriaMenuSection,
  MenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  MenuTriggerProps,
  SubmenuTrigger as AriaSubmenuTrigger,
  SubmenuTriggerProps,
} from 'react-aria-components';
import { Popover } from './Popover.tsx';
import './Menu.css';
import React from 'react';

export interface MenuButtonProps<T extends object>
  extends MenuProps<T>,
    Omit<MenuTriggerProps, 'children'> {
  label?: React.ReactNode;
}

export function MenuButton<T extends object>({ label, children, ...props }: MenuButtonProps<T>) {
  return (
    <MenuTrigger {...props}>
      <Button>{label}</Button>
      <Popover hideArrow>
        <Menu {...props}>{children}</Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export function Menu<T extends object>(props: MenuProps<T>) {
  return <AriaMenu {...props}>{props.children}</AriaMenu>;
}

export function MenuItem(props: Omit<MenuItemProps, 'children'> & { children?: React.ReactNode }) {
  let textValue = props.textValue || undefined;
  return (
    <AriaMenuItem {...props} textValue={textValue}>
      {({ hasSubmenu }) => (
        <>
          {props.children}
          {hasSubmenu && <ChevronRight size={16} className="chevron" aria-hidden />}
        </>
      )}
    </AriaMenuItem>
  );
}

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  return <AriaMenuSection {...props} />;
}

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  let [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover hideArrow>{menu}</Popover>
    </AriaSubmenuTrigger>
  );
}
