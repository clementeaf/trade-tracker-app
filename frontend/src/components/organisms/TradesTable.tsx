import React, { useState } from 'react';
import type { TradesTableProps } from './types';
import Table from '../atoms/Table';
import { tradeTableColumns } from './utils';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import type { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';

const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleExportCSV = () => {
    exportToCSV(trades, `trades-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportJSON = () => {
    exportToJSON(trades, `trades-${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <Table
      columns={tradeTableColumns}
      data={trades}
      sorting={sorting}
      onSortingChange={setSorting}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      searchPlaceholder="Buscar por par, precio, fecha..."
      pagination={pagination}
      onPaginationChange={setPagination}
      pageSize={10}
      showExportButtons={true}
      onExportCSV={handleExportCSV}
      onExportJSON={handleExportJSON}
    />
  );
};

export default TradesTable;   