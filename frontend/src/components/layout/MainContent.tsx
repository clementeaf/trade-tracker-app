import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ children, isSidebarOpen }) => {
  return (
    <div className={`
      flex-1 flex flex-col min-h-screen bg-white
      transition-all duration-300 ease-in-out
      ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
    `}>
      {/* Header principal */}
      <header className="
        flex items-center justify-between h-16 px-6 
        border-b border-gray-200 bg-white
        lg:px-8
      ">
        {/* Botón de menú para móviles */}
        <button
          onClick={() => {
            // Este botón se maneja desde el Layout
            // Aquí solo es para mostrar la estructura
          }}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Título de la página */}
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <h1 className="text-xl font-semibold text-black">
            Dashboard
          </h1>
        </div>

        {/* Acciones del header (placeholder) */}
        <div className="flex items-center space-x-4">
          <button className="
            p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100
            transition-colors duration-200
          ">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainContent; 