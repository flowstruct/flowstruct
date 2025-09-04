import { Badge } from '@mantine/core';
import classes from '@/shared/styles/ActiveStatus.module.css';

type Props = {
  archivedAt: Date | null;
};

export function ArchiveStatusBadge({ archivedAt }: Props) {
  const isArchived = archivedAt !== null;
  return (
    <Badge
      classNames={{ root: classes.root }}
      variant={isArchived ? 'outline' : 'light'}
      color={isArchived ? 'gray' : 'green'}
    >
      {isArchived ? 'Archived' : 'Active'}
    </Badge>
  );
}
