import { useMemo, useReducer } from 'react';
import TradesTable from '../components/organisms/TradesTable';
import Modal from '../components/atoms/Modal';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import TextArea from '../components/atoms/TextArea';
import { MultiImageUpload } from '../components/molecules/MultiImageUpload';
import RiskCalculator from '../components/molecules/RiskCalculator';
import { formFields } from './utils';
import { 
  tradesReducer, 
  initialState, 
  getAvailablePars, 
} from './functions';
import { useTrades } from '../hooks/useTrades';
import { useTradeModal } from '../hooks/useTradeModal';
import type { Trade } from '../services/tradeService';

const Trades = () => {
  const { trades, addTrade, loading, error } = useTrades();
  const [state, dispatch] = useReducer(tradesReducer, initialState);
  
  const { state: modalState, handleSubmit, handleChange, handleImagesUploaded, openModal, closeModal } = useTradeModal(trades, addTrade);

  const availablePars = useMemo(() => {
    if (loading || !trades) return [];
    return getAvailablePars(trades);
  }, [trades, loading]);

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
        <Button onClick={openModal}>
          Añadir operación
        </Button>
      </div>

      {/* Calculadora de Riesgo */}
      <RiskCalculator trades={trades} />

      <TradesTable trades={trades} />

      <Modal 
        open={modalState.modal.isOpen} 
        onClose={closeModal} 
        title="Nueva operación"
        widthClass="max-w-2xl"
      >
        {modalState.modal.successMsg && (
          <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 text-sm font-medium">
            {modalState.modal.successMsg}
          </div>
        )}
        {modalState.modal.errorMsg && (
          <div className="mb-4 px-4 py-2 rounded bg-red-100 text-red-800 text-sm font-medium">
            {modalState.modal.errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={modalState.modal.form[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          ))}
          
          {/* Campo de observaciones */}
          <TextArea
            label="Observaciones"
            name="observaciones"
            value={modalState.modal.form.observaciones}
            onChange={handleChange}
            placeholder="Describe tu análisis, estrategia, o cualquier observación relevante sobre esta operación..."
            rows={4}
          />
          
          {/* Subida de imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes de la operativa
            </label>
            <MultiImageUpload
              onImagesUploaded={handleImagesUploaded}
              onUploadError={(error) => {
                // Mostrar error en el modal
                console.error('Error subiendo imágenes:', error);
              }}
              maxImages={5}
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
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