import { api } from './api';

export interface Trade {
  id: number;
  par: string;
  precio_apertura: number;
  take_profit: number;
  stop_loss: number;
  fecha_apertura: string;
  fecha_cierre?: string;
  motivo_cierre?: string;
  observaciones?: string;
  imagenes?: string[];
}

export interface CreateTradeRequest {
  par: string;
  precio_apertura: number;
  take_profit: number;
  stop_loss: number;
  observaciones?: string;
  imagenes?: string[];
}

export interface UpdateTradeRequest {
  par?: string;
  precio_apertura?: number;
  take_profit?: number;
  stop_loss?: number;
}

export const tradeService = {
  // Obtener todos los trades
  async getTrades(): Promise<Trade[]> {
    const response = await api.get('/trades');
    return response as Trade[];
  },

  // Obtener un trade específico
  async getTrade(id: number): Promise<Trade> {
    const response = await api.get(`/trades/${id}`);
    return response as Trade;
  },

  // Crear un nuevo trade
  async createTrade(trade: CreateTradeRequest): Promise<Trade> {
    const response = await api.post('/trades', trade);
    return response as Trade;
  },

  // Actualizar un trade
  async updateTrade(id: number, trade: UpdateTradeRequest): Promise<Trade> {
    const response = await api.put(`/trades/${id}`, trade);
    return response as Trade;
  },

  // Eliminar un trade
  async deleteTrade(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/trades/${id}`);
    return response as { message: string };
  },

  // Cerrar un trade
  async closeTrade(id: number, motivo: string): Promise<Trade> {
    const response = await api.put(`/trades/${id}`, {
      fecha_cierre: new Date().toISOString(),
      motivo_cierre: motivo,
    });
    return response as Trade;
  },
}; 