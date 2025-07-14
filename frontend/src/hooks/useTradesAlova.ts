import { useState, useEffect, useCallback } from 'react';
import { tradeService } from '../services/tradeService';
import type { Trade, CreateTradeRequest, UpdateTradeRequest } from '../services/tradeService';

export const useTradesAlova = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar trades desde el backend
  const loadTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tradesData = await tradeService.getTrades();
      setTrades(tradesData);
    } catch (err) {
      setError('Error al cargar los trades desde el backend');
      console.error('Error loading trades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar trades al montar el componente
  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  // Crear nuevo trade
  const addTrade = useCallback(async (tradeData: CreateTradeRequest) => {
    try {
      setError(null);
      const newTrade = await tradeService.createTrade(tradeData);
      setTrades(prev => [...prev, newTrade]);
      return newTrade;
    } catch (err) {
      setError('Error al crear el trade');
      console.error('Error creating trade:', err);
      throw err;
    }
  }, []);

  // Actualizar trade
  const updateTrade = useCallback(async (tradeId: number, updates: UpdateTradeRequest) => {
    try {
      setError(null);
      const updatedTrade = await tradeService.updateTrade(tradeId, updates);
      setTrades(prev => prev.map(trade => 
        trade.id === tradeId ? updatedTrade : trade
      ));
      return updatedTrade;
    } catch (err) {
      setError('Error al actualizar el trade');
      console.error('Error updating trade:', err);
      throw err;
    }
  }, []);

  // Eliminar trade
  const deleteTrade = useCallback(async (tradeId: number) => {
    try {
      setError(null);
      await tradeService.deleteTrade(tradeId);
      setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    } catch (err) {
      setError('Error al eliminar el trade');
      console.error('Error deleting trade:', err);
      throw err;
    }
  }, []);

  // Cerrar trade
  const closeTrade = useCallback(async (tradeId: number, motivo: string) => {
    try {
      setError(null);
      const closedTrade = await tradeService.closeTrade(tradeId, motivo);
      setTrades(prev => prev.map(trade => 
        trade.id === tradeId ? closedTrade : trade
      ));
      return closedTrade;
    } catch (err) {
      setError('Error al cerrar el trade');
      console.error('Error closing trade:', err);
      throw err;
    }
  }, []);

  // Obtener trade específico
  const getTrade = useCallback(async (tradeId: number) => {
    try {
      setError(null);
      const trade = await tradeService.getTrade(tradeId);
      return trade;
    } catch (err) {
      setError('Error al obtener el trade');
      console.error('Error getting trade:', err);
      throw err;
    }
  }, []);

  // Recargar trades
  const refreshTrades = useCallback(() => {
    loadTrades();
  }, [loadTrades]);

  return {
    trades,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    closeTrade,
    getTrade,
    refreshTrades,
  };
}; 