import { Degree, Program } from '@/features/program/types.ts';
import { Select } from '@mantine/core';
import React from 'react';
import { Table } from '@tanstack/react-table';

type Props = {
  table: Table<Program>;
};

export function ProgramDegreeFilter({ table }: Props) {
  const degreeColumn = React.useMemo(() => table.getColumn('degree'), [table]);
  if (!degreeColumn) return;

  const filteredDegree = degreeColumn.getFilterValue();

  return (
    <Select
      placeholder="Filter by degree"
      data={Object.entries(Degree).map(([key, value]) => ({
        value: key,
        label: `${value} (${key})`,
      }))}
      value={typeof filteredDegree === 'string' ? filteredDegree : null}
      onChange={(val) => degreeColumn.setFilterValue(val)}
      clearable
      searchable
      onClear={() => degreeColumn.setFilterValue(null)}
    />
  );
}
