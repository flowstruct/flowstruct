import { ComboboxData, MultiSelect } from '@mantine/core';
import { FrameworkCourse, Section } from '@/features/study-plan/types.ts';
import { Table } from '@tanstack/react-table';
import { getSectionDisplayName } from '@/utils/getSectionDisplayName.ts';
import React from 'react';
import { List } from 'lucide-react';

type Props = {
  table: Table<FrameworkCourse>;
  sections: Section[];
};

export function SectionColumnFilter({ table, sections }: Props) {
  const sectionColumn = React.useMemo(() => table.getColumn('section'), [table]);
  if (!sectionColumn) return null;

  const values = sectionColumn.getFilterValue() as number[];

  const handleFilter = (values: string[]) => {
    const parsedValues = values.map((val) => Number(val));

    if (parsedValues.length === 0) {
      sectionColumn.setFilterValue(undefined);
      return;
    }

    sectionColumn.setFilterValue(parsedValues);
  };

  const data: ComboboxData = sections.map((section) => ({
    value: String(section.id),
    label: getSectionDisplayName(section),
  }));

  return (
    <MultiSelect
      clearable
      value={values ? values.map((val) => String(val)) : []}
      data={data}
      leftSection={<List size={16} />}
      placeholder="Filter by section..."
      searchable
      nothingFoundMessage="No sections found..."
      onChange={handleFilter}
    />
  );
}
