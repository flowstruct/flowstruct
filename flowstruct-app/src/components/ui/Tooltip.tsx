'use client';
import {
    Tooltip as AriaTooltip,
    type TooltipProps as AriaTooltipProps,
    TooltipTrigger as AriaTooltipTrigger,
    type TooltipTriggerComponentProps,
} from 'react-aria-components';

import './Tooltip.css';
import React from 'react';  1

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
    children: React.ReactNode;
}

export function Tooltip({children, ...props}: TooltipProps) {
    return <AriaTooltip {...props}>{children}</AriaTooltip>;
}

export function TooltipTrigger({delay = 200, ...props}: TooltipTriggerComponentProps) {
    return <AriaTooltipTrigger delay={delay} {...props} />;
}
