import React, { useState } from 'react';
import type { Widget, DashboardProps } from '../../types';
import { calculateTradeStats, formatCurrency } from '../../utils/statsUtils';
import { renderWidget, type MetricWidgetResult, type ListWidgetResult } from '../../pages/functions';
import Button from '../atoms/Button';

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'total-trades',
      type: 'metric',
      title: 'Total Operaciones',
      config: { metric: 'totalTrades' },
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'win-rate',
      type: 'metric',
      title: 'Win Rate',
      config: { metric: 'winRate' },
      position: { x: 1, y: 0 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'total-profit',
      type: 'metric',
      title: 'Profit Total',
      config: { metric: 'totalProfit' },
      position: { x: 2, y: 0 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'recent-trades',
      type: 'list',
      title: 'Operaciones Recientes',
      config: { limit: 5 },
      position: { x: 0, y: 1 },
      size: { width: 2, height: 2 },
    },
  ]);

  const stats = calculateTradeStats(trades);

  const renderMetricWidget = (widget: Widget) => {
    const result = renderWidget(widget, stats, trades);
    if (!result || widget.type !== 'metric') return null;

    const metricResult = result as MetricWidgetResult;
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{metricResult.title}</h3>
        <p className={`text-3xl font-bold ${metricResult.color}`}>{metricResult.value}</p>
      </div>
    );
  };

  const renderListWidget = (widget: Widget) => {
    const result = renderWidget(widget, stats, trades);
    if (!result || widget.type !== 'list') return null;

    const listResult = result as ListWidgetResult;
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{listResult.title}</h3>
        <div className="space-y-3">
          {listResult.trades.map(trade => (
            <div key={trade.nro} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{trade.par}</p>
                <p className="text-sm text-gray-600">
                  {new Date(trade.fechaApertura).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(trade.precioApertura)}</p>
                <p className={`text-sm ${trade.fechaCierre ? 'text-green-600' : 'text-yellow-600'}`}>
                  {trade.fechaCierre ? 'Cerrada' : 'Abierta'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWidgetComponent = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':
        return renderMetricWidget(widget);
      case 'list':
        return renderListWidget(widget);
      default:
        return <div>Widget no soportado</div>;
    }
  };

  const addWidget = () => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: 'metric',
      title: 'Nuevo Widget',
      config: { metric: 'totalTrades' },
      position: { x: 0, y: widgets.length },
      size: { width: 1, height: 1 },
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Button onClick={addWidget}>
          Agregar Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {widgets.map(widget => (
          <div key={widget.id} className="relative">
            {renderWidgetComponent(widget)}
            <button
              onClick={() => removeWidget(widget.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
              title="Eliminar widget"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {widgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay widgets configurados</p>
          <Button onClick={addWidget}>
            Agregar Primer Widget
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 