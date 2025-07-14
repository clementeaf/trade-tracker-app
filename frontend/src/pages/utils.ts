import type { Trade } from '../models/Trade';

export const initialTrades: Trade[] = [
  {
    nro: 1,
    par: 'BTC/USDT',
    precioApertura: 65000,
    takeProfit: 67000,
    stopLoss: 64000,
    fechaApertura: '2024-07-15 09:00',
    fechaCierre: '2024-07-15 15:30',
    motivoCierre: 'Take Profit alcanzado',
  },
  {
    nro: 2,
    par: 'ETH/USDT',
    precioApertura: 3500,
    takeProfit: 3700,
    stopLoss: 3400,
    fechaApertura: '2024-07-16 10:15',
    fechaCierre: '2024-07-16 13:45',
    motivoCierre: 'Stop Loss alcanzado',
  },
];

export const initialForm = { 
  par: '', 
  precioApertura: '', 
  takeProfit: '', 
  stopLoss: '', 
  observaciones: '',
  imagenes: [] as string[]
};

export const formFields = [
  { name: 'par', label: 'Par', type: 'text', required: true },
  { name: 'precioApertura', label: 'Precio Apertura', type: 'number', required: true },
  { name: 'takeProfit', label: 'Take Profit', type: 'number', required: true },
  { name: 'stopLoss', label: 'Stop Loss', type: 'number', required: true },
] as const;

export type FormField = typeof formFields[number]; 