import { useState, useEffect, useCallback } from 'react';
import { tradeService, type Trade, type CreateTradeRequest } from '../services/tradeService';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar trades desde la API
  const loadTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTrades = await tradeService.getTrades();
      setTrades(fetchedTrades);
    } catch (err) {
      setError('Error al cargar los trades desde la API');
      console.error('Error loading trades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const addTrade = useCallback(async (tradeData: CreateTradeRequest) => {
    try {
      setError(null);
      const newTrade = await tradeService.createTrade(tradeData);
      setTrades(prev => [newTrade, ...prev]); // Agregar al inicio
      return newTrade;
    } catch (err) {
      setError('Error al crear el trade');
      console.error('Error creating trade:', err);
      throw err;
    }
  }, []);

  const updateTrade = useCallback(async (tradeId: number, updates: Partial<Trade>) => {
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

  const closeTrade = useCallback(async (tradeId: number, motivoCierre: string) => {
    try {
      setError(null);
      const fechaCierre = new Date().toISOString();
      const closedTrade = await tradeService.closeTrade(tradeId, motivoCierre);
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
    refreshTrades,
  };
}; 