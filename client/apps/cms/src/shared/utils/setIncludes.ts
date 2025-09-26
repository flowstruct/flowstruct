import { Row } from '@tanstack/react-table';

export const setIncludes = (row: Row<any>, columnId: string, filterValue: Set<number>) =>
  filterValue.size > 0 ? filterValue.has(row.getValue(columnId)) : true;
