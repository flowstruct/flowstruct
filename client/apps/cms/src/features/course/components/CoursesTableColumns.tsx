import { createColumnHelper } from '@tanstack/react-table';
import { CourseSummary } from '@/features/course/types.ts';
import { Badge } from '@mantine/core';
import { CourseTableOptionsMenu } from '@/features/course/components/CourseTableOptionsMenu.tsx';
import { LastUpdatedStats } from '@/shared/components/LastUpdatedStats.tsx';
import { OutdatedStatusBadge } from '@/shared/components/OutdatedStatusBadge.tsx';

export function getCoursesTableColumns() {
  const { accessor, display } = createColumnHelper<CourseSummary>();

  return [
    accessor('outdatedAt', {
      header: '',
      cell: ({ row }) => (
        <OutdatedStatusBadge
          outdatedAt={row.original.outdatedAt}
          outdatedBy={row.original.outdatedBy}
          entityType="course"
        />
      ),
      enableColumnFilter: true,
      filterFn: (row, _columnId, filterValue) => {
        if (filterValue === 'active') {
          return row.original.outdatedAt === null;
        }

        if (filterValue === 'outdated') {
          return row.original.outdatedAt !== null;
        }

        return true;
      },
    }),
    accessor('code', {
      header: 'Code',
      cell: ({ cell }) => <Badge variant="default">{cell.getValue()}</Badge>,
    }),
    accessor('name', {
      header: 'Name',
    }),
    accessor('creditHours', {
      header: 'Cr.',
      cell: ({ row }) => <p style={{ textWrap: 'nowrap' }}>{row.original.creditHours} Cr.</p>,
    }),
    accessor('type', {
      header: 'Type',
    }),
    display({
      id: 'last-updated',
      header: 'Last Updated',
      cell: ({ row }) => (
        <LastUpdatedStats at={row.original.updatedAt} by={row.original.updatedBy} />
      ),
    }),
    display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <CourseTableOptionsMenu course={row.original} />,
    }),
  ];
}
