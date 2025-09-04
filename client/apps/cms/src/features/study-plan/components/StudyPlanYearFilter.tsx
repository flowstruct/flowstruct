import { YearPickerInput } from '@mantine/dates';
import { Calendar } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { StudyPlanRow } from '@/features/study-plan/types.ts';
import React from 'react';

type Props = {
  table: Table<StudyPlanRow>;
};

export function StudyPlanYearFilter({ table }: Props) {
  const yearColumn = React.useMemo(() => table.getColumn('year'), [table]);
  if (!yearColumn) return null;

  const filteredYear = yearColumn.getFilterValue() as number | undefined;

  const handleFilter = (val: string) => {
    if (!val) {
      yearColumn.setFilterValue(undefined);
      return;
    }

    const year = Number(val.split('-')[0]);
    yearColumn.setFilterValue(year);
  };

  return (
    <YearPickerInput
      w={200}
      value={typeof filteredYear === 'number' ? new Date(filteredYear, 0, 1) : null}
      placeholder="Filter by year"
      onChange={handleFilter}
      leftSection={<Calendar size={18} />}
      allowDeselect
      clearable

    />
  );
}
