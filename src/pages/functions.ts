import type { Trade } from '../models/Trade';
import { Trade as TradeModel } from '../models/Trade';

export const getNextNro = (trades: Trade[]) => trades.length > 0 ? Math.max(...trades.map(t => t.nro)) + 1 : 1;

export const createTradeFromForm = (form: { par: string; precioApertura: string; takeProfit: string; stopLoss: string }, trades: Trade[]) => {
  const nro = getNextNro(trades);
  return TradeModel.create({
    par: form.par,
    precioApertura: Number(form.precioApertura),
    takeProfit: Number(form.takeProfit),
    stopLoss: Number(form.stopLoss),
    fechaCierre: undefined,
    motivoCierre: undefined,
  }, nro);
}; 