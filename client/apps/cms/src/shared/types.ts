import React, { ReactNode } from 'react';
import { ColumnFilter } from '@tanstack/react-table';

export interface ErrorObject {
  statusCode: number;
  messages: string[];
  timestamp: string;
}

export type SidebarLinks = {
  label: string;
  icon: ReactNode;
  route: string;
};

export type TabOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

export type FilterSearchParams = {
  filter: string;
  page: number;
  size: number;
  columnFilters: ColumnFilter[];
};
