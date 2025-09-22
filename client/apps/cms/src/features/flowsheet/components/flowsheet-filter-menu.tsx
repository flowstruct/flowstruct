import { Menu, MenuItem, MenuTrigger, SubmenuTrigger } from '@/shared/components/ui/Menu.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Calendar, GraduationCap, ListFilter, TextIcon } from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Table } from '@tanstack/react-table';
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { getAvailableFlowsheetYears } from '@/features/flowsheet/domain/getAvailableFlowsheetYears.ts';
import { GridList, GridListItem } from '@/shared/components/ui/GridList.tsx';

type FlowsheetFilterMenuProps = {
  table: Table<FlowsheetSummary>;
};

export function FlowsheetFilterMenu({ table }: FlowsheetFilterMenuProps) {
  return (
    <MenuTrigger>
      <Button variant="transparent" size="sm">
        <ListFilter size={16} /> Filter
      </Button>
      <Popover hideArrow>
        <Menu>
          <ProgramFilter table={table} />
          <YearFilter table={table} />
          <TrackFilter table={table} />
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

function YearFilter({ table }: { table: Table<FlowsheetSummary> }) {
  const { data: flowsheets } = useSuspenseQuery(flowsheetQueries.list);

  const availableYears = React.useMemo(() => getAvailableFlowsheetYears(flowsheets), [flowsheets]);

  const applyYearFilter = (year: number) => {
    table.getColumn('year')?.setFilterValue(year);
  };

  return (
    <SubmenuTrigger>
      <MenuItem textValue="Year">
        <Calendar size={14} /> Available years
      </MenuItem>
      <Popover hideArrow>
        <Menu>
          {availableYears.map((year) => (
            <MenuItem
              key={year}
              textValue={`${year} - ${year + 1}`}
              onPress={() => applyYearFilter(year)}
            >
              <Calendar size={14} /> {year} - {year + 1}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </SubmenuTrigger>
  );
}

function ProgramFilter({ table }: { table: Table<FlowsheetSummary> }) {
  const { data: programs } = useSuspenseQuery(programQueries.list);

  return (
    <SubmenuTrigger>
      <MenuItem textValue="Year">
        <GraduationCap size={14} /> Programs
      </MenuItem>
      <Popover hideArrow>
        <GridList aria-label="Programs" items={programs} selectionMode="multiple">
          {(item) => {
            const displayName = getProgramDisplayName(item);
            return (
              <GridListItem textValue={displayName}>
                <GraduationCap size={14} /> {displayName}
              </GridListItem>
            );
          }}
        </GridList>
      </Popover>
    </SubmenuTrigger>
  );
}

function TrackFilter({table}: { table: Table<FlowsheetSummary>}) {
  return (
    <MenuItem textValue="Track"><TextIcon size={14} /> Track</MenuItem>
  );
}