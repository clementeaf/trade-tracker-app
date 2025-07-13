import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('renderiza el layout con sidebar y contenido principal', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <div>Contenido de prueba</div>
        </Layout>
      </BrowserRouter>
    );

    // Verificar que el sidebar esté presente
    expect(screen.getByText('Trade Tracker')).toBeInTheDocument();
    expect(screen.getByText('Trades')).toBeInTheDocument();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Verificar que el contenido principal esté presente
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });
}); 