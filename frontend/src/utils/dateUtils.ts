import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fecha actual
export const getCurrentDateFormatted = (): string => {
  const now = new Date();
  return format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
};

// Formatear fecha con hora
export const getCurrentDateTimeFormatted = (): string => {
  const now = new Date();
  return format(now, 'dd/MM/yyyy HH:mm:ss', { locale: es });
};

// Formatear fecha desde ISO string
export const formatDateFromISO = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'dd/MM/yyyy', { locale: es });
};

// Obtener tiempo relativo (ej: "hace 2 horas")
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: es,
  });
};

// Formatear fecha para trading (formato corto)
export const formatTradingDate = (date: Date): string => {
  return format(date, 'dd/MM/yy HH:mm', { locale: es });
};
