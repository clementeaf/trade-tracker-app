import { useMemo } from 'react';
import { applyFilters } from '../utils/filterUtils';
import { hasActiveFilters, formatFilterDisplay } from '../pages/functions';
import type { FilterOptions } from '../components/molecules/AdvancedFilters';
import type { Trade } from '../models/Trade';

export const useTradeFilters = (trades: Trade[], filters: FilterOptions) => {
  const filteredTrades = useMemo(() => applyFilters(trades, filters), [trades, filters]);
  const filterDisplay = useMemo(() => formatFilterDisplay(filters), [filters]);
  const hasFilters = useMemo(() => hasActiveFilters(filters), [filters]);

  return {
    filteredTrades,
    filterDisplay,
    hasFilters,
  };
}; 