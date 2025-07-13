import React, { useState } from 'react';
import type { TradesTableProps } from './types';
import Table from '../atoms/Table';
import type { Trade } from '../../models/Trade';
import { tradeTableColumns } from './utils';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';

const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <Table
      columns={tradeTableColumns}
      data={trades}
      sorting={sorting}
      onSortingChange={setSorting}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
    />
  );
};

export default TradesTable;   