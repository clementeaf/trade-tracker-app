import React from 'react';
import PostList from './components/organisms/PostList';
import Button from './components/atoms/Button';
import Card from './components/molecules/Card';
import {
  getCurrentDateFormatted,
  getCurrentDateTimeFormatted,
  getRelativeTime,
} from './utils/dateUtils';

function App() {
  const currentDate = getCurrentDateFormatted();
  const currentDateTime = getCurrentDateTimeFormatted();
  const relativeTime = getRelativeTime(new Date());

  // Mostrar información de fecha en consola
  console.log('=== Información de Fechas ===');
  console.log('Fecha actual formateada:', currentDate);
  console.log('Fecha y hora actual:', currentDateTime);
  console.log('Tiempo relativo:', relativeTime);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Trade Tracker App
              </h1>
              <p className="mt-1 text-gray-600">
                Aplicación de demostración con React + Vite + Tailwind +
                TanStack Query + AlovaJS
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{currentDate}</p>
              <p className="text-xs text-gray-400">{currentDateTime}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Sección de demostración de componentes */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Demostración de Componentes
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Demostración de Botones */}
            <Card title="Botones" subtitle="Componentes Atom">
              <div className="space-y-3">
                <Button variant="primary" size="sm">
                  Botón Primario
                </Button>
                <Button variant="secondary" size="md">
                  Botón Secundario
                </Button>
                <Button variant="outline" size="lg">
                  Botón Outline
                </Button>
              </div>
            </Card>

            {/* Demostración de Fechas */}
            <Card title="Utilidades de Fechas" subtitle="date-fns">
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Fecha actual:</strong> {currentDate}
                </p>
                <p>
                  <strong>Fecha y hora:</strong> {currentDateTime}
                </p>
                <p>
                  <strong>Tiempo relativo:</strong> {relativeTime}
                </p>
              </div>
            </Card>

            {/* Información del Stack */}
            <Card title="Stack Tecnológico" subtitle="Tecnologías utilizadas">
              <div className="space-y-2 text-sm">
                <p>✅ React + Vite</p>
                <p>✅ TypeScript</p>
                <p>✅ Tailwind CSS v3</p>
                <p>✅ TanStack Query</p>
                <p>✅ AlovaJS</p>
                <p>✅ date-fns</p>
                <p>✅ ESLint + Prettier</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Sección de datos con TanStack Query y AlovaJS */}
        <div className="mb-8">
          <Card title="Datos de API" subtitle="TanStack Query + AlovaJS">
            <p className="mb-4 text-gray-600">
              Esta sección demuestra la integración de TanStack Query con
              AlovaJS para obtener datos de una API externa (JSONPlaceholder).
            </p>
            <PostList />
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="text-center text-gray-500">
            <p>Trade Tracker App - Demostración de Stack Moderno</p>
            <p className="mt-1 text-sm">
              Desarrollado con React, Vite, Tailwind CSS, TanStack Query y
              AlovaJS
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
