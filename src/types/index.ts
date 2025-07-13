import type { Trade } from '../models/Trade';
import type { FilterOptions } from '../components/molecules/AdvancedFilters';
import { initialForm } from '../pages/utils';

// Tipos para el Dashboard
export interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'list';
  title: string;
  config: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DashboardProps {
  trades: Trade[];
}

// Tipos para el estado de Trades
export interface TradesState {
  modal: {
    isOpen: boolean;
    form: typeof initialForm;
    successMsg: string;
    errorMsg: string;
  };
  filters: FilterOptions;
}

export type TradesAction = 
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'UPDATE_FORM'; payload: Partial<typeof initialForm> }
  | { type: 'RESET_FORM' }
  | { type: 'SET_SUCCESS_MSG'; payload: string }
  | { type: 'SET_ERROR_MSG'; payload: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_FILTERS'; payload: FilterOptions }
  | { type: 'CLEAR_FILTERS' };

// Tipos para filtros
export interface FilterDisplayItem {
  key: string;
  value: string;
}

// Tipos para estadísticas
export interface TradeStats {
  totalTrades: number;
  closedTrades: number;
  openTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
} 