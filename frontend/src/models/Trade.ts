export interface TradeProps {
  nro: number;
  par: string;
  precioApertura: number;
  takeProfit: number;
  stopLoss: number;
  fechaApertura: string;
  fechaCierre?: string;
  motivoCierre?: string;
  observaciones?: string;
  imagenes?: string[]; // URLs de las imágenes en S3
}

export class Trade {
  nro: number;
  par: string;
  precioApertura: number;
  takeProfit: number;
  stopLoss: number;
  fechaApertura: string;
  fechaCierre?: string;
  motivoCierre?: string;
  observaciones?: string;
  imagenes?: string[];

  constructor(props: TradeProps) {
    this.nro = props.nro;
    this.par = props.par;
    this.precioApertura = props.precioApertura;
    this.takeProfit = props.takeProfit;
    this.stopLoss = props.stopLoss;
    this.fechaApertura = props.fechaApertura;
    this.fechaCierre = props.fechaCierre;
    this.motivoCierre = props.motivoCierre;
    this.observaciones = props.observaciones;
    this.imagenes = props.imagenes || [];
  }

  static validate(props: Partial<TradeProps>): string | null {
    if (!props.par || !props.par.trim()) return 'El par es obligatorio.';
    if (!props.precioApertura || props.precioApertura <= 0) return 'Precio de apertura inválido.';
    if (!props.takeProfit || props.takeProfit <= 0) return 'Take Profit inválido.';
    if (!props.stopLoss || props.stopLoss <= 0) return 'Stop Loss inválido.';
    return null;
  }

  static create(props: Omit<TradeProps, 'nro' | 'fechaApertura'>, nro: number): Trade {
    const now = new Date();
    const fechaApertura = now.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ').slice(0, 16);
    return new Trade({
      nro,
      ...props,
      fechaApertura,
      imagenes: props.imagenes || [],
    });
  }
} 