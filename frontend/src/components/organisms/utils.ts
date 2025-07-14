import type { TableColumn } from '../atoms/types';
import type { Trade } from '../../models/Trade';

export const tradeTableColumns: TableColumn<Trade>[] = [
  { key: 'nro', header: 'Nro' },
  { key: 'par', header: 'Par' },
  { key: 'precioApertura', header: 'Precio Apertura' },
  { key: 'takeProfit', header: 'Take Profit' },
  { key: 'stopLoss', header: 'Stop Loss' },
  { key: 'fechaApertura', header: 'Fecha/Hora Apertura' },
  { key: 'fechaCierre', header: 'Fecha/Hora Cierre', render: (v) => v || '-' },
  { key: 'motivoCierre', header: 'Motivo de cierre', render: (v) => v || '-' },
  { 
    key: 'observaciones', 
    header: 'Observaciones', 
    render: (v) => v ? (v.length > 50 ? `${v.substring(0, 50)}...` : v) : '-',
    className: 'max-w-xs'
  },
  { 
    key: 'imagenes', 
    header: 'Imágenes', 
    render: (v) => {
      const images = v || [];
      return images.length > 0 ? `${images.length} imagen(es)` : 'Sin imágenes';
    },
    className: 'w-32'
  },
]; 