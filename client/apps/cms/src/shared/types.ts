import { ReactNode } from 'react';
import { ColumnFilter } from '@tanstack/react-table';

export interface ErrorObject {
  statusCode: number;
  messages: string[];
  timestamp: string;
}

export type NavbarLinks = {
  label: string;
  icon: ReactNode;
  route: string;
};

export type TableSearchOptions = {
  filter: string;
  page: number;
  size: number;
  columnFilters: ColumnFilter[];
};
