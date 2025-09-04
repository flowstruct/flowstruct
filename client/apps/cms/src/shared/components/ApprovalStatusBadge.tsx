import { Badge } from '@mantine/core';
import classes from '@/features/program/styles/StatusBadge.module.css';
import { Check, Pencil, Plus } from 'lucide-react';

export function ApprovalStatusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return (
        <Badge
          variant="light"
          classNames={{ root: classes.root }}
          leftSection={<Check size={14} />}
        >
          Approved
        </Badge>
      );
    case 'DRAFT':
      return (
        <Badge
          variant="outline"
          classNames={{ root: classes.root }}
          leftSection={<Pencil size={14} />}
        >
          Draft
        </Badge>
      );
    case 'NEW':
      return (
        <Badge
          variant="outline"
          classNames={{ root: classes.root }}
          leftSection={<Plus size={14} />}
        >
          New
        </Badge>
      );
    default:
      return null;
  }
}
