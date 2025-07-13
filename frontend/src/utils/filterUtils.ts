import type { Trade } from '../models/Trade';
import type { FilterOptions } from '../components/molecules/AdvancedFilters';

type FilterFunction = (trade: Trade) => boolean;

export const createTradeFilters = (filters: FilterOptions): FilterFunction[] => {
  const filterFunctions: FilterFunction[] = [];

  // Filtro por fecha desde
  if (filters.dateFrom) {
    const filterDate = new Date(filters.dateFrom);
    filterFunctions.push(trade => new Date(trade.fechaApertura) >= filterDate);
  }

  // Filtro por fecha hasta
  if (filters.dateTo) {
    const filterDate = new Date(filters.dateTo);
    filterFunctions.push(trade => new Date(trade.fechaApertura) <= filterDate);
  }

  // Filtro por precio desde
  if (filters.priceFrom) {
    filterFunctions.push(trade => trade.precioApertura >= filters.priceFrom!);
  }

  // Filtro por precio hasta
  if (filters.priceTo) {
    filterFunctions.push(trade => trade.precioApertura <= filters.priceTo!);
  }

  // Filtro por Take Profit desde
  if (filters.takeProfitFrom) {
    filterFunctions.push(trade => trade.takeProfit >= filters.takeProfitFrom!);
  }

  // Filtro por Take Profit hasta
  if (filters.takeProfitTo) {
    filterFunctions.push(trade => trade.takeProfit <= filters.takeProfitTo!);
  }

  // Filtro por Stop Loss desde
  if (filters.stopLossFrom) {
    filterFunctions.push(trade => trade.stopLoss >= filters.stopLossFrom!);
  }

  // Filtro por Stop Loss hasta
  if (filters.stopLossTo) {
    filterFunctions.push(trade => trade.stopLoss <= filters.stopLossTo!);
  }

  // Filtro por par
  if (filters.par) {
    filterFunctions.push(trade => trade.par === filters.par);
  }

  // Filtro por estado
  if (filters.status === 'open') {
    filterFunctions.push(trade => !trade.fechaCierre);
  } else if (filters.status === 'closed') {
    filterFunctions.push(trade => !!trade.fechaCierre);
  }

  return filterFunctions;
};

export const applyFilters = (trades: Trade[], filters: FilterOptions): Trade[] => {
  const filterFunctions = createTradeFilters(filters);
  
  return trades.filter(trade => 
    filterFunctions.every(filterFn => filterFn(trade))
  );
}; 