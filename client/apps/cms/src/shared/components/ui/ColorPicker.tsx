'use client';
import {
  ColorPicker as AriaColorPicker,
  ColorPickerProps as AriaColorPickerProps
} from 'react-aria-components';
import {DialogTrigger} from './Dialog.tsx';
import {Button} from './Button.tsx';
import {ColorSwatch} from './ColorSwatch.tsx';
import {ColorSlider} from './ColorSlider.tsx';
import {ColorArea} from './ColorArea.tsx';
import {ColorField} from './ColorField.tsx';
import {Popover} from './Popover.tsx';

import './ColorPicker.css';

export interface ColorPickerProps extends AriaColorPickerProps {
  label?: string;
  children?: React.ReactNode;
}

export function ColorPicker({ label, children, ...props }: ColorPickerProps) {
  return (
    (
      <AriaColorPicker {...props}>
        <DialogTrigger>
          <Button className="color-picker">
            <ColorSwatch />
            <span>{label}</span>
          </Button>
          <Popover hideArrow placement="bottom start" className="color-picker-dialog">
            {children || (
              <>
                <ColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider colorSpace="hsb" channel="hue" />
                <ColorField label="Hex" />
              </>
            )}
          </Popover>
        </DialogTrigger>
      </AriaColorPicker>
    )
  );
}
