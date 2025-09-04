import { ActionIcon, Badge, Checkbox, Group, Text } from '@mantine/core';
import { ArrowDownUp } from 'lucide-react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FrameworkCourse } from '@/features/study-plan/types.ts';
import { PrerequisitePillGroup } from '@/features/study-plan/components/PrerequisitePillGroup.tsx';
import { StudyPlanCourseOptionsMenu } from '@/features/study-plan/components/StudyPlanCourseOptionsMenu.tsx';
import { OutdatedStatusBadge } from '@/shared/components/OutdatedStatusBadge.tsx';
import { EntityNameWithStatus } from '@/shared/components/EntityNameWithStatus.tsx';

export function getStudyPlanCoursesTableColumns(): ColumnDef<FrameworkCourse>[] {
  const columnHelper = createColumnHelper<FrameworkCourse>();

  return [
    columnHelper.display({
      id: 'selection',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),

    columnHelper.accessor('code', {
      header: ({ column }) => (
        <Group wrap="nowrap">
          <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
            <ArrowDownUp size={14} />
          </ActionIcon>
          Code
        </Group>
      ),
      sortingFn: 'alphanumeric',
      cell: ({ row }) => <Badge variant="default">{row.original.code}</Badge>,
    }) as ColumnDef<FrameworkCourse>,

    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Group wrap="nowrap">
          <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
            <ArrowDownUp size={14} />
          </ActionIcon>
          Name
        </Group>
      ),
      cell: ({ row }) => (
        <EntityNameWithStatus
          entity={row.original}
          entityType="course"
        />
      ),
      sortingFn: 'alphanumeric',
    }) as ColumnDef<FrameworkCourse>,

    columnHelper.accessor('creditHours', {
      header: 'Cr.',
      sortingFn: 'alphanumeric',
      cell: ({ row }) => <p style={{ textWrap: 'nowrap' }}>{row.original.creditHours} Cr.</p>,
    }) as ColumnDef<FrameworkCourse>,

    columnHelper.display({
      id: 'prerequisites',
      header: 'Pre / Corequisites',
      cell: ({ row }) => <PrerequisitePillGroup parentCourseId={row.original.id} />,
    }),

    columnHelper.accessor('section', {
      header: ({ column }) => (
        <Group wrap="nowrap">
          <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
            <ArrowDownUp size={14} />
          </ActionIcon>
          Section
        </Group>
      ),
      cell: ({ row }) => row.original.sectionCode,
      sortingFn: 'alphanumeric',
      enableColumnFilter: true,
      filterFn: (row, _, filterValue: number[]) => {
        return filterValue.includes(row.original.section);
      },
    }) as ColumnDef<FrameworkCourse>,

    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <StudyPlanCourseOptionsMenu course={row.original} sectionId={row.original.section} />
      ),
    }),
  ];
}
