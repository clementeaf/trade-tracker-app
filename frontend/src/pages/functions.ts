import type { Trade } from '../models/Trade';
import { Trade as TradeModel } from '../models/Trade';
import type { TradesState, TradesAction, Widget, TradeStats } from '../types';
import { initialForm } from './utils';
import { formatCurrency, formatPercentage } from '../utils/statsUtils';

// Funciones de validación y creación
export const validateTradeForm = (form: typeof initialForm): string | null => {
  return TradeModel.validate({
    par: form.par,
    precioApertura: Number(form.precioApertura),
    takeProfit: Number(form.takeProfit),
    stopLoss: Number(form.stopLoss),
  });
};

export const getNextNro = (trades: Trade[]): number => {
  return trades.length > 0 ? Math.max(...trades.map(t => t.nro)) + 1 : 1;
};

export const createTradeFromForm = (form: typeof initialForm, trades: Trade[]): Trade => {
  const nro = getNextNro(trades);
  return TradeModel.create({
    par: form.par,
    precioApertura: Number(form.precioApertura),
    takeProfit: Number(form.takeProfit),
    stopLoss: Number(form.stopLoss),
    fechaCierre: undefined,
    motivoCierre: undefined,
  }, nro);
};

// Funciones de utilidad para trades
export const getAvailablePars = (trades: Trade[]): string[] => {
  const pars = new Set(trades.map(t => t.par));
  return Array.from(pars).sort();
};

// --- RESTAURADO: Renderizado de widgets para Dashboard ---
export interface MetricWidgetResult {
  value: string | number;
  color: string;
  title: string;
}

export interface ListWidgetResult {
  trades: Trade[];
  title: string;
}

export const renderMetricWidget = (widget: Widget, stats: TradeStats): MetricWidgetResult => {
  const { metric } = widget.config;
  let value: string | number = '';
  let color = 'text-gray-900';

  switch (metric) {
    case 'totalTrades':
      value = stats.totalTrades;
      break;
    case 'closedTrades':
      value = stats.closedTrades;
      break;
    case 'openTrades':
      value = stats.openTrades;
      break;
    case 'winRate':
      value = formatPercentage(stats.winRate);
      color = 'text-green-600';
      break;
    case 'totalProfit':
      value = formatCurrency(stats.totalProfit);
      color = stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600';
      break;
    case 'averageProfit':
      value = formatCurrency(stats.averageProfit);
      color = stats.averageProfit >= 0 ? 'text-green-600' : 'text-red-600';
      break;
  }

  return {
    value,
    color,
    title: widget.title,
  };
};

export const renderListWidget = (widget: Widget, trades: Trade[]): ListWidgetResult => {
  const { limit } = widget.config;
  const recentTrades = trades
    .sort((a, b) => new Date(b.fechaApertura).getTime() - new Date(a.fechaApertura).getTime())
    .slice(0, limit);

  return {
    trades: recentTrades,
    title: widget.title,
  };
};

export const renderWidget = (widget: Widget, stats: TradeStats, trades: Trade[]): MetricWidgetResult | ListWidgetResult | null => {
  switch (widget.type) {
    case 'metric':
      return renderMetricWidget(widget, stats);
    case 'list':
      return renderListWidget(widget, trades);
    default:
      return null;
  }
};
// --- FIN RESTAURADO ---

// --- Funciones de cálculo para RiskCalculator ---

export function calculateCurrentCapital(trades: Trade[], capital: number): number {
  const closedTrades = trades.filter(trade => trade.fechaCierre);
  const totalProfit = closedTrades.reduce((sum, trade) => {
    const entryPrice = trade.precioApertura;
    const takeProfit = trade.takeProfit;
    const stopLoss = trade.stopLoss;
    // Estimación: 50% éxito, 50% pérdida
    const estimatedProfit = (takeProfit - entryPrice) * 0.5 + (stopLoss - entryPrice) * 0.5;
    return sum + estimatedProfit;
  }, 0);
  return capital + totalProfit;
}

export function getRiskStats(trades: Trade[]) {
  const closedTrades = trades.filter(trade => trade.fechaCierre);
  const openTrades = trades.filter(trade => !trade.fechaCierre);
  const totalTrades = trades.length;
  return { closedTrades, openTrades, totalTrades };
}

// Trades Reducer
export const initialState: TradesState = {
  modal: {
    isOpen: false,
    form: initialForm,
    successMsg: '',
    errorMsg: '',
  },
  filters: {},
};

export const tradesReducer = (state: TradesState, action: TradesAction): TradesState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        modal: { ...state.modal, isOpen: true },
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: { ...state.modal, isOpen: false },
      };
    case 'UPDATE_FORM':
      return {
        ...state,
        modal: {
          ...state.modal,
          form: { ...state.modal.form, ...action.payload },
        },
      };
    case 'RESET_FORM':
      return {
        ...state,
        modal: {
          ...state.modal,
          form: initialForm,
        },
      };
    case 'SET_SUCCESS_MSG':
      return {
        ...state,
        modal: {
          ...state.modal,
          successMsg: action.payload,
          errorMsg: '',
        },
      };
    case 'SET_ERROR_MSG':
      return {
        ...state,
        modal: {
          ...state.modal,
          errorMsg: action.payload,
          successMsg: '',
        },
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        modal: {
          ...state.modal,
          successMsg: '',
          errorMsg: '',
        },
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {},
      };
    default:
      return state;
  }
}; 