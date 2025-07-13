import React from 'react';
import type { TableColumn } from './types';

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => React.Key;
  className?: string;
}

function Table<T>({ columns, data, rowKey, className = '' }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 bg-white ${className}`}>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th key={String(col.key)} className={`px-4 py-3 font-semibold ${col.className || ''}`}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={rowKey ? rowKey(row, i) : i} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className={`px-4 py-2 ${col.className || ''}`}>
                  {col.render ? col.render(row[col.key], row, i) : row[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table; 