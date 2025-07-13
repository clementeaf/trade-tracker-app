import React, { useState } from 'react';
import { formatCurrency } from '../../utils/statsUtils';
import type { Trade } from '../../models/Trade';
import { calculateCurrentCapital, getRiskStats } from '../../pages/functions';

interface RiskCalculatorProps {
  trades: Trade[];
}

const RiskCalculator: React.FC<RiskCalculatorProps> = ({ trades }) => {
  const [capital, setCapital] = useState<number>(10000); // Capital inicial por defecto

  const currentCapital = calculateCurrentCapital(trades, capital);
  const currentOnePercentRisk = currentCapital * 0.01;
  const { closedTrades, openTrades, totalTrades } = getRiskStats(trades);

  return (
    <section className="rounded-xl border border-blue-100 bg-white/70 shadow-sm px-4 py-3 md:py-2 md:px-6 flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
      {/* Capital Inicial editable */}
      <div className="flex flex-col items-start md:items-center md:flex-row gap-1 md:gap-2 min-w-[180px]">
        <span className="text-xs text-gray-500">Capital inicial</span>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
          className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          min={0}
        />
      </div>

      {/* Capital actual */}
      <div className="flex flex-col items-start md:items-center md:flex-row gap-1 md:gap-2 min-w-[180px]">
        <span className="text-xs text-gray-500">Capital actual</span>
        <span className="font-semibold text-green-600 text-base">{formatCurrency(currentCapital)}</span>
      </div>

      {/* Stop Loss Máximo */}
      <div className="flex flex-col items-start md:items-center md:flex-row gap-1 md:gap-2 min-w-[180px]">
        <span className="text-xs text-gray-500">Stop Loss máx. (1%)</span>
        <span className="font-semibold text-red-500 text-base">{formatCurrency(currentOnePercentRisk)}</span>
      </div>

      {/* Stats compactas */}
      <div className="hidden md:flex flex-row gap-4 ml-auto">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Trades</span>
          <span className="text-xs font-semibold text-blue-700">{totalTrades}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Cerrados</span>
          <span className="text-xs font-semibold text-green-600">{closedTrades.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Abiertos</span>
          <span className="text-xs font-semibold text-yellow-600">{openTrades.length}</span>
        </div>
      </div>

      {/* Recordatorio discreto */}
      <div className="w-full md:w-auto mt-2 md:mt-0 flex items-center gap-2 text-xs text-blue-500 justify-end">
        <span className="hidden md:inline">|</span>
        <span className="inline-flex items-center gap-1">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3b82f6" opacity=".15"/><path d="M12 8v4m0 4h.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
          Máximo 1% por trade
        </span>
      </div>
    </section>
  );
};

export default RiskCalculator; 