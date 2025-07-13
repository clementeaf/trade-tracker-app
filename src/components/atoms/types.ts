export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => React.Key;
  className?: string;
}

export interface ColumnMeta {
  className?: string;
} 