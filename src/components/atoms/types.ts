export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
} 