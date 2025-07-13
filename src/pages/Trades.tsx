import React, { useState } from 'react';
import TradesTable from '../components/organisms/TradesTable';
import type { Trade } from '../models/Trade';
import { Trade as TradeModel } from '../models/Trade';
import Modal from '../components/atoms/Modal';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

const initialTrades: Trade[] = [
  {
    nro: 1,
    par: 'BTC/USDT',
    precioApertura: 65000,
    takeProfit: 67000,
    stopLoss: 64000,
    fechaApertura: '2024-07-15 09:00',
    fechaCierre: '2024-07-15 15:30',
    motivoCierre: 'Take Profit alcanzado',
  },
  {
    nro: 2,
    par: 'ETH/USDT',
    precioApertura: 3500,
    takeProfit: 3700,
    stopLoss: 3400,
    fechaApertura: '2024-07-16 10:15',
    fechaCierre: '2024-07-16 13:45',
    motivoCierre: 'Stop Loss alcanzado',
  },
];

const Trades = () => {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    par: '',
    precioApertura: '',
    takeProfit: '',
    stopLoss: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    // Validación usando el modelo Trade
    const validation = TradeModel.validate({
      par: form.par,
      precioApertura: Number(form.precioApertura),
      takeProfit: Number(form.takeProfit),
      stopLoss: Number(form.stopLoss),
    });
    if (validation) {
      setErrorMsg(validation);
      return;
    }
    try {
      const nro = trades.length > 0 ? Math.max(...trades.map(t => t.nro)) + 1 : 1;
      const newTrade = TradeModel.create({
        par: form.par,
        precioApertura: Number(form.precioApertura),
        takeProfit: Number(form.takeProfit),
        stopLoss: Number(form.stopLoss),
        fechaCierre: undefined,
        motivoCierre: undefined,
      }, nro);
      setTrades([...trades, newTrade]);
      setSuccessMsg('¡Operación guardada con éxito!');
      setForm({ par: '', precioApertura: '', takeProfit: '', stopLoss: '' });
      setTimeout(() => {
        setSuccessMsg('');
        setModalOpen(false);
      }, 1500);
    } catch (err) {
      setErrorMsg('Ocurrió un error inesperado al guardar.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Trades</h2>
        <Button onClick={() => setModalOpen(true)}>
          Añadir operación
        </Button>
      </div>
      <TradesTable trades={trades} />

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
          <Input
            label="Par"
            name="par"
            value={form.par}
            onChange={handleChange}
            required
          />
          <Input
            label="Precio Apertura"
            name="precioApertura"
            type="number"
            value={form.precioApertura}
            onChange={handleChange}
            required
          />
          <Input
            label="Take Profit"
            name="takeProfit"
            type="number"
            value={form.takeProfit}
            onChange={handleChange}
            required
          />
          <Input
            label="Stop Loss"
            name="stopLoss"
            type="number"
            value={form.stopLoss}
            onChange={handleChange}
            required
          />
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