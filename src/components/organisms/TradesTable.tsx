import React from 'react';
import Table from '../atoms/Table';
import type { TradesTableProps } from './types';
import { tradeTableColumns } from './utils';

const TradesTable: React.FC<TradesTableProps> = ({ trades }) => (
  <Table columns={tradeTableColumns} data={trades} rowKey={(row) => row.nro} />
);

export default TradesTable;   