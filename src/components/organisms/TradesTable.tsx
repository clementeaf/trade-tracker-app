import React from 'react';

export interface Trade {
  nro: number;
  par: string;
  precioApertura: number;
  takeProfit: number;
  stopLoss: number;
  fechaApertura: string;
  fechaCierre?: string;
  motivoCierre?: string;
}

interface TradesTableProps {
  trades: Trade[];
}

const TradesTable: React.FC<TradesTableProps> = ({ trades }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
    <table className="min-w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="px-4 py-3 font-semibold">Nro</th>
          <th className="px-4 py-3 font-semibold">Par</th>
          <th className="px-4 py-3 font-semibold">Precio Apertura</th>
          <th className="px-4 py-3 font-semibold">Take Profit</th>
          <th className="px-4 py-3 font-semibold">Stop Loss</th>
          <th className="px-4 py-3 font-semibold">Fecha/Hora Apertura</th>
          <th className="px-4 py-3 font-semibold">Fecha/Hora Cierre</th>
          <th className="px-4 py-3 font-semibold">Motivo de cierre</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade) => (
          <tr key={trade.nro} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-2">{trade.nro}</td>
            <td className="px-4 py-2">{trade.par}</td>
            <td className="px-4 py-2">{trade.precioApertura}</td>
            <td className="px-4 py-2">{trade.takeProfit}</td>
            <td className="px-4 py-2">{trade.stopLoss}</td>
            <td className="px-4 py-2 whitespace-nowrap">{trade.fechaApertura}</td>
            <td className="px-4 py-2 whitespace-nowrap">{trade.fechaCierre || '-'}</td>
            <td className="px-4 py-2">{trade.motivoCierre || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TradesTable; 