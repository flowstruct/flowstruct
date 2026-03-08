import { Button } from './Button';
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
import { Popover } from './Popover';
import './Menu.css';
import React from 'react';

export interface MenuButtonProps<T extends object>
  extends Omit<ExtendedMenuProps<T>, 'width'>, Omit<MenuTriggerProps, 'children'> {
  label?: React.ReactNode;
  width?: number;
}

export function MenuButton<T extends object>({
  label,
  children,
  width,
  ...props
}: MenuButtonProps<T>) {
  return (
    <MenuTrigger {...props}>
      <Button>{label}</Button>
      <Popover hideArrow>
        <Menu width={width} {...props}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export interface ExtendedMenuProps<T extends object> extends MenuProps<T> {
  width?: number;
}

export function Menu<T extends object>({ width, ...props }: ExtendedMenuProps<T>) {
  return (
    <AriaMenu {...props} style={width ? { width: `${width}px` } : undefined}>
      {props.children}
    </AriaMenu>
  );
}

export function MenuItem(props: MenuItemProps) {
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
