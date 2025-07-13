import React, { useState } from 'react';
import TradesTable from '../components/organisms/TradesTable';
import type { Trade } from '../models/Trade';
import { Trade as TradeModel } from '../models/Trade';
import Modal from '../components/atoms/Modal';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { initialTrades, initialForm, formFields } from './utils';
import { createTradeFromForm } from './functions';

const Trades = () => {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    if (validation) return setErrorMsg(validation);
    try {
      const newTrade = createTradeFromForm(form, trades);
      setTrades([...trades, newTrade]);
      setSuccessMsg('¡Operación guardada con éxito!');
      setForm(initialForm);
      setTimeout(() => {
        setSuccessMsg('');
        setModalOpen(false);
      }, 1500);
    } catch {
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