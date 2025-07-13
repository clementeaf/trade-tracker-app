import React, { useState, useEffect, useRef } from 'react';
import TradesTable from '../components/organisms/TradesTable';
import type { Trade } from '../components/organisms/TradesTable';

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
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal con Esc
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Cerrar modal al hacer clic fuera
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      setModalOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    // Validaciones básicas
    if (!form.par.trim() || !form.precioApertura || !form.takeProfit || !form.stopLoss) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }
    if (Number(form.precioApertura) <= 0 || Number(form.takeProfit) <= 0 || Number(form.stopLoss) <= 0) {
      setErrorMsg('Los valores numéricos deben ser mayores a cero.');
      return;
    }
    try {
      const nro = trades.length > 0 ? Math.max(...trades.map(t => t.nro)) + 1 : 1;
      const now = new Date();
      const fechaApertura = now.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ').slice(0, 16);
      setTrades([
        ...trades,
        {
          nro,
          par: form.par,
          precioApertura: Number(form.precioApertura),
          takeProfit: Number(form.takeProfit),
          stopLoss: Number(form.stopLoss),
          fechaApertura,
        },
      ]);
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
        <button
          className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-gray-900 transition-colors"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          Añadir operación
        </button>
      </div>
      <TradesTable trades={trades} />

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          ref={modalRef}
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={() => setModalOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-6">Nueva operación</h3>
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
              <div>
                <label className="block text-sm font-medium mb-1">Par</label>
                <input
                  type="text"
                  name="par"
                  value={form.par}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio Apertura</label>
                <input
                  type="number"
                  name="precioApertura"
                  value={form.precioApertura}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Take Profit</label>
                <input
                  type="number"
                  name="takeProfit"
                  value={form.takeProfit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stop Loss</label>
                <input
                  type="number"
                  name="stopLoss"
                  value={form.stopLoss}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-gray-200 text-black font-semibold hover:bg-gray-300 transition-colors"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trades; 