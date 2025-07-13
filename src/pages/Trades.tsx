import { useMemo, useReducer } from 'react';
import TradesTable from '../components/organisms/TradesTable';
import Modal from '../components/atoms/Modal';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import AdvancedFilters from '../components/molecules/AdvancedFilters';
import type { FilterOptions } from '../components/molecules/AdvancedFilters';
import type { FilterDisplayItem } from '../types';
import { formFields } from './utils';
import { 
  tradesReducer, 
  initialState, 
  getAvailablePars, 
} from './functions';
import { useTrades } from '../hooks/useTrades';
import { useTradeModal } from '../hooks/useTradeModal';
import { useTradeFilters } from '../hooks/useTradeFilters';

const Trades = () => {
  const { trades, addTrade, loading, error } = useTrades();
  const [state, dispatch] = useReducer(tradesReducer, initialState);
  
  const { state: modalState, handleSubmit, handleChange, openModal, closeModal } = useTradeModal(trades, addTrade);
  const { filteredTrades, filterDisplay, hasFilters } = useTradeFilters(trades, state.filters);

  const availablePars = useMemo(() => getAvailablePars(trades), [trades]);

  const handleFiltersChange = (filters: FilterOptions) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

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

      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        availablePars={availablePars}
      />

      {hasFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Filtros activos:</h3>
          <div className="flex flex-wrap gap-2">
            {filterDisplay.map(({ key, value }: FilterDisplayItem) => (
              <span key={key} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}

      <TradesTable trades={filteredTrades} />

      <Modal 
        open={modalState.modal.isOpen} 
        onClose={closeModal} 
        title="Nueva operación"
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