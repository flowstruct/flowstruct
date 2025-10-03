import { TabOption } from '@/shared/types';
import { CircleDashed, CircleDot, Layers2 } from 'lucide-react';
import { ArchiveStatus } from '@/features/flowsheet/domain/flowsheet.ts';

export const getFlowsheetTabs = (): TabOption<ArchiveStatus>[] => [
  { value: 'all', label: 'All flowsheets', icon: <Layers2 size={14} /> },
  { value: 'active', label: 'Active', icon: <CircleDot size={14} /> },
  { value: 'archived', label: 'Archived', icon: <CircleDashed size={14} /> },
];
