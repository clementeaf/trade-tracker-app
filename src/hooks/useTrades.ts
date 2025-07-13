import { useState, useEffect, useCallback } from 'react';
import type { Trade } from '../models/Trade';
import { storageUtils } from '../utils/storageUtils';
import { initialTrades } from '../pages/utils';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar trades al inicializar
  useEffect(() => {
    try {
      const storedTrades = storageUtils.getTrades();
      
      // Si no hay trades guardados, usar los iniciales
      if (storedTrades.length === 0) {
        storageUtils.saveTrades(initialTrades);
        setTrades(initialTrades);
      } else {
        setTrades(storedTrades);
      }
    } catch (err) {
      setError('Error al cargar los trades');
      console.error('Error loading trades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar trades automáticamente cuando cambien
  useEffect(() => {
    if (!loading) {
      storageUtils.saveTrades(trades);
    }
  }, [trades, loading]);

  const addTrade = useCallback((newTrade: Trade) => {
    setTrades(prev => [...prev, newTrade]);
  }, []);

  const updateTrade = useCallback((tradeId: number, updates: Partial<Trade>) => {
    setTrades(prev => prev.map(trade => 
      trade.nro === tradeId ? { ...trade, ...updates } : trade
    ));
  }, []);

  const deleteTrade = useCallback((tradeId: number) => {
    setTrades(prev => prev.filter(trade => trade.nro !== tradeId));
  }, []);

  const closeTrade = useCallback((tradeId: number, fechaCierre: string, motivoCierre: string) => {
    updateTrade(tradeId, { fechaCierre, motivoCierre });
  }, [updateTrade]);

  const resetTrades = useCallback(() => {
    setTrades(initialTrades);
    storageUtils.saveTrades(initialTrades);
  }, []);

  const importTrades = useCallback((importedTrades: Trade[]) => {
    setTrades(importedTrades);
    storageUtils.saveTrades(importedTrades);
  }, []);

  return {
    trades,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    closeTrade,
    resetTrades,
    importTrades,
  };
}; 