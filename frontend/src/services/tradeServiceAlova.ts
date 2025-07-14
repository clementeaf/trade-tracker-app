import { alova, createApiUrl } from './alova';

export interface Trade {
  id: number;
  par: string;
  precio_apertura: number;
  take_profit: number;
  stop_loss: number;
  fecha_apertura: string;
  fecha_cierre?: string;
  motivo_cierre?: string;
}

export interface CreateTradeRequest {
  par: string;
  precio_apertura: number;
  take_profit: number;
  stop_loss: number;
}

export interface UpdateTradeRequest {
  par?: string;
  precio_apertura?: number;
  take_profit?: number;
  stop_loss?: number;
}

// Servicio de trades usando alovaJS
export const tradeServiceAlova = {
  // Obtener todos los trades
  async getTrades(): Promise<Trade[]> {
    const response = await alova.Get(createApiUrl('/trades')).send();
    return response as Trade[];
  },

  // Obtener un trade específico
  async getTrade(id: number): Promise<Trade> {
    const response = await alova.Get(createApiUrl(`/trades/${id}`)).send();
    return response as Trade;
  },

  // Crear un nuevo trade
  async createTrade(trade: CreateTradeRequest): Promise<Trade> {
    const response = await alova.Post(createApiUrl('/trades'), trade).send();
    return response as Trade;
  },

  // Actualizar un trade
  async updateTrade(id: number, trade: UpdateTradeRequest): Promise<Trade> {
    const response = await alova.Put(createApiUrl(`/trades/${id}`), trade).send();
    return response as Trade;
  },

  // Eliminar un trade
  async deleteTrade(id: number): Promise<{ message: string }> {
    const response = await alova.Delete(createApiUrl(`/trades/${id}`)).send();
    return response as { message: string };
  },

  // Cerrar un trade
  async closeTrade(id: number, motivo: string): Promise<Trade> {
    const response = await alova.Put(createApiUrl(`/trades/${id}`), {
      fecha_cierre: new Date().toISOString(),
      motivo_cierre: motivo,
    }).send();
    return response as Trade;
  },
}; 