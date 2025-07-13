import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
  it('renderiza el layout con sidebar y contenido principal', () => {
    render(
      <Layout>
        <div>Contenido de prueba</div>
      </Layout>
    );

    // Verificar que el sidebar esté presente
    expect(screen.getByText('TradeTracker')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Verificar que el contenido principal esté presente
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });
}); 