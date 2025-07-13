import { useReducer } from 'react';
import { Trade as TradeModel } from '../models/Trade';
import { notificationManager } from '../utils/notificationUtils';
import { tradesReducer, initialState } from '../pages/functions';
import { initialForm } from '../pages/utils';
import type { Trade } from '../models/Trade';

export const useTradeModal = (trades: Trade[], addTrade: (trade: Trade) => void) => {
  const [state, dispatch] = useReducer(tradesReducer, initialState);

  const validateTradeForm = (form: typeof initialForm): string | null => {
    return TradeModel.validate({
      par: form.par,
      precioApertura: Number(form.precioApertura),
      takeProfit: Number(form.takeProfit),
      stopLoss: Number(form.stopLoss),
    });
  };

  const createTradeFromForm = (form: typeof initialForm): Trade => {
    const nro = trades.length > 0 ? Math.max(...trades.map(t => t.nro)) + 1 : 1;
    return TradeModel.create({
      par: form.par,
      precioApertura: Number(form.precioApertura),
      takeProfit: Number(form.takeProfit),
      stopLoss: Number(form.stopLoss),
      fechaCierre: undefined,
      motivoCierre: undefined,
    }, nro);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_MESSAGES' });
    
    const validation = validateTradeForm(state.modal.form);
    
    if (validation) {
      dispatch({ type: 'SET_ERROR_MSG', payload: validation });
      notificationManager.error('Error de validación', validation);
      return;
    }
    
    try {
      const newTrade = createTradeFromForm(state.modal.form);
      addTrade(newTrade);
      dispatch({ type: 'SET_SUCCESS_MSG', payload: '¡Operación guardada con éxito!' });
      notificationManager.success('Operación guardada', `Nueva operación ${newTrade.par} agregada exitosamente`);
      dispatch({ type: 'RESET_FORM' });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_MESSAGES' });
        dispatch({ type: 'CLOSE_MODAL' });
      }, 1500);
    } catch (error) {
      const errorMessage = 'Ocurrió un error inesperado al guardar.';
      dispatch({ type: 'SET_ERROR_MSG', payload: errorMessage });
      notificationManager.error('Error al guardar', errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_FORM', payload: { [e.target.name]: e.target.value } });
  };

  const openModal = () => dispatch({ type: 'OPEN_MODAL' });
  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });

  return {
    state,
    handleSubmit,
    handleChange,
    openModal,
    closeModal,
  };
}; 