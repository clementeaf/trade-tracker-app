import { describe, it, expect } from 'vitest';
import { getCurrentDateFormatted, getCurrentDateTimeFormatted, formatDateFromISO, getRelativeTime, formatTradingDate } from './dateUtils';

describe('dateUtils', () => {
  it('formatea la fecha actual correctamente', () => {
    const result = getCurrentDateFormatted();
    expect(result).toMatch(/\d{1,2} de [a-zA-Z]+ de \d{4}/);
  });

  it('formatea la fecha y hora actual correctamente', () => {
    const result = getCurrentDateTimeFormatted();
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
  });

  it('formatea una fecha ISO correctamente', () => {
    const result = formatDateFromISO('2024-07-12T12:00:00Z');
    expect(result).toBe('12/07/2024');
  });

  it('devuelve tiempo relativo', () => {
    const result = getRelativeTime(new Date(Date.now() - 60 * 1000));
    expect(result).toMatch(/hace/);
  });

  it('formatea fecha para trading', () => {
    const date = new Date('2024-07-12T15:30:00Z');
    const result = formatTradingDate(date);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}/);
  });
}); 