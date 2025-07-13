import type { Trade } from '../models/Trade';

export interface TradeStats {
  totalTrades: number;
  closedTrades: number;
  openTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  tradesByPar: Record<string, number>;
  monthlyStats: Array<{
    month: string;
    trades: number;
    profit: number;
  }>;
}

export const calculateTradeStats = (trades: Trade[]): TradeStats => {
  const closedTrades = trades.filter(t => t.fechaCierre);
  const openTrades = trades.filter(t => !t.fechaCierre);
  
  // Calcular ganancias/pérdidas (simulado)
  const tradesWithProfit = closedTrades.map(trade => ({
    ...trade,
    profit: calculateTradeProfit(trade),
  }));

  const totalProfit = tradesWithProfit.reduce((sum, t) => sum + t.profit, 0);
  const winningTrades = tradesWithProfit.filter(t => t.profit > 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

  // Agrupar por par
  const tradesByPar = trades.reduce((acc, trade) => {
    acc[trade.par] = (acc[trade.par] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas mensuales
  const monthlyStats = calculateMonthlyStats(trades);

  return {
    totalTrades: trades.length,
    closedTrades: closedTrades.length,
    openTrades: openTrades.length,
    winRate,
    totalProfit,
    averageProfit: closedTrades.length > 0 ? totalProfit / closedTrades.length : 0,
    bestTrade: tradesWithProfit.length > 0 ? 
      tradesWithProfit.reduce((best, current) => current.profit > best.profit ? current : best) : null,
    worstTrade: tradesWithProfit.length > 0 ? 
      tradesWithProfit.reduce((worst, current) => current.profit < worst.profit ? current : worst) : null,
    tradesByPar,
    monthlyStats,
  };
};

const calculateTradeProfit = (trade: Trade): number => {
  // Simulación simple de ganancia/pérdida basada en Take Profit vs Stop Loss
  // En una implementación real, esto se calcularía con datos reales de mercado
  const randomFactor = Math.random();
  if (randomFactor > 0.5) {
    // Trade ganador
    return trade.takeProfit - trade.precioApertura;
  } else {
    // Trade perdedor
    return trade.stopLoss - trade.precioApertura;
  }
};

const calculateMonthlyStats = (trades: Trade[]) => {
  const monthlyData: Record<string, { trades: number; profit: number }> = {};
  
  trades.forEach(trade => {
    const date = new Date(trade.fechaApertura);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { trades: 0, profit: 0 };
    }
    
    monthlyData[monthKey].trades += 1;
    if (trade.fechaCierre) {
      monthlyData[monthKey].profit += calculateTradeProfit(trade);
    }
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      trades: data.trades,
      profit: data.profit,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
}; 