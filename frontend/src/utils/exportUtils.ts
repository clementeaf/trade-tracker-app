import type { Trade } from '../models/Trade';

export const exportToCSV = (trades: Trade[], filename = 'trades.csv') => {
  const headers = [
    'Nro',
    'Par',
    'Precio Apertura',
    'Take Profit',
    'Stop Loss',
    'Fecha/Hora Apertura',
    'Fecha/Hora Cierre',
    'Motivo de cierre',
  ];

  const csvContent = [
    headers.join(','),
    ...trades.map(trade => [
      trade.nro,
      trade.par,
      trade.precioApertura,
      trade.takeProfit,
      trade.stopLoss,
      trade.fechaApertura,
      trade.fechaCierre || '',
      trade.motivoCierre || '',
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (trades: Trade[], filename = 'trades.json') => {
  const jsonContent = JSON.stringify(trades, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}; 