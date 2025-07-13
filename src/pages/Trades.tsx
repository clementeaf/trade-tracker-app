import React, { useState, useMemo } from 'react';
import TradesTable from '../components/organisms/TradesTable';
import { Trade as TradeModel } from '../models/Trade';
import Modal from '../components/atoms/Modal';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import AdvancedFilters from '../components/molecules/AdvancedFilters';
import type { FilterOptions } from '../components/molecules/AdvancedFilters';
import { initialForm, formFields } from './utils';
import { createTradeFromForm } from './functions';
import { useTrades } from '../hooks/useTrades';
import { notificationManager } from '../utils/notificationUtils';

const Trades = () => {
  const { trades, addTrade, loading, error } = useTrades();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  // Obtener pares únicos para filtros
  const availablePars = useMemo(() => {
    const pars = new Set(trades.map(t => t.par));
    return Array.from(pars).sort();
  }, [trades]);

  // Aplicar filtros
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Filtro por fecha
      if (activeFilters.dateFrom) {
        const tradeDate = new Date(trade.fechaApertura);
        const filterDate = new Date(activeFilters.dateFrom);
        if (tradeDate < filterDate) return false;
      }
      if (activeFilters.dateTo) {
        const tradeDate = new Date(trade.fechaApertura);
        const filterDate = new Date(activeFilters.dateTo);
        if (tradeDate > filterDate) return false;
      }

      // Filtro por precio
      if (activeFilters.priceFrom && trade.precioApertura < activeFilters.priceFrom) return false;
      if (activeFilters.priceTo && trade.precioApertura > activeFilters.priceTo) return false;

      // Filtro por Take Profit
      if (activeFilters.takeProfitFrom && trade.takeProfit < activeFilters.takeProfitFrom) return false;
      if (activeFilters.takeProfitTo && trade.takeProfit > activeFilters.takeProfitTo) return false;

      // Filtro por Stop Loss
      if (activeFilters.stopLossFrom && trade.stopLoss < activeFilters.stopLossFrom) return false;
      if (activeFilters.stopLossTo && trade.stopLoss > activeFilters.stopLossTo) return false;

      // Filtro por par
      if (activeFilters.par && trade.par !== activeFilters.par) return false;

      // Filtro por estado
      if (activeFilters.status === 'open' && trade.fechaCierre) return false;
      if (activeFilters.status === 'closed' && !trade.fechaCierre) return false;

      return true;
    });
  }, [trades, activeFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    const validation = TradeModel.validate({
      par: form.par,
      precioApertura: Number(form.precioApertura),
      takeProfit: Number(form.takeProfit),
      stopLoss: Number(form.stopLoss),
    });
    
    if (validation) {
      setErrorMsg(validation);
      notificationManager.error('Error de validación', validation);
      return;
    }
    
    try {
      const newTrade = createTradeFromForm(form, trades);
      addTrade(newTrade);
      setSuccessMsg('¡Operación guardada con éxito!');
      notificationManager.success('Operación guardada', `Nueva operación ${newTrade.par} agregada exitosamente`);
      setForm(initialForm);
      setTimeout(() => {
        setSuccessMsg('');
        setModalOpen(false);
      }, 1500);
    } catch (error) {
      const errorMessage = 'Ocurrió un error inesperado al guardar.';
      setErrorMsg(errorMessage);
      notificationManager.error('Error al guardar', errorMessage);
    }
  };

  const handleFiltersChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando operaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Trades</h2>
        <Button onClick={() => setModalOpen(true)}>
          Añadir operación
        </Button>
      </div>

      {/* Filtros avanzados */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        availablePars={availablePars}
      />

      {/* Información de filtros activos */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Filtros activos:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <span key={key} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}

      <TradesTable trades={filteredTrades} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva operación">
        {successMsg && (
          <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 text-sm font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 px-4 py-2 rounded bg-red-100 text-red-800 text-sm font-medium">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAddTrade} className="space-y-4">
          {formFields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          ))}
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trades; 