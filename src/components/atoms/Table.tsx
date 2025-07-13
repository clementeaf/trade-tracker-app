import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import type { TableProps } from './types';
import Button from './Button';

function Table<T extends Record<string, any>>({ 
  columns, 
  data, 
  rowKey, 
  className = '',
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = "Buscar...",
  pagination,
  onPaginationChange,
  pageSize = 10,
  showExportButtons = false,
  onExportCSV,
  onExportJSON,
}: TableProps<T> & {
  sorting?: SortingState;
  onSortingChange?: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  searchPlaceholder?: string;
  pagination?: PaginationState;
  onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  pageSize?: number;
  showExportButtons?: boolean;
  onExportCSV?: () => void;
  onExportJSON?: () => void;
}) {
  const tableColumns = useMemo<ColumnDef<T>[]>(() => 
    columns.map(col => ({
      accessorKey: col.key as string,
      header: col.header,
      cell: ({ getValue, row }) => 
        col.render ? col.render(getValue(), row.original, row.index) : getValue(),
    })), [columns]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: sorting || [],
      columnFilters: columnFilters || [],
      globalFilter: globalFilter || '',
      pagination: pagination || { pageIndex: 0, pageSize },
    },
    onSortingChange: onSortingChange || (() => {}),
    onColumnFiltersChange: onColumnFiltersChange || (() => {}),
    onGlobalFilterChange: onGlobalFilterChange || (() => {}),
    onPaginationChange: onPaginationChange || (() => {}),
  });

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 bg-white ${className}`}>
      {/* Search and Export Bar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        {onGlobalFilterChange && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter || ''}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        )}
        
        {showExportButtons && onExportCSV && onExportJSON && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onExportCSV}>
              Exportar CSV
            </Button>
            <Button variant="secondary" onClick={onExportJSON}>
              Exportar JSON
            </Button>
          </div>
        )}
      </div>
      
      <table className="min-w-full text-left text-sm">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-between">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="ml-2">
                        {header.column.getIsSorted() === 'asc' ? '↑' : 
                         header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr 
              key={rowKey ? rowKey(row.original, i) : row.id} 
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      {onPaginationChange && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Results Info */}
      <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200">
        Mostrando {table.getFilteredRowModel().rows.length} de {data.length} resultados
      </div>
    </div>
  );
}

export default Table; 