import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { name: 'Trades', to: '/trades' },
  { name: 'Estadísticas', to: '/estadisticas' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo/Título superior */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-black tracking-tight select-none">Dashboard</span>
        </div>

        {/* Navegación */}
        <nav className="mt-8 px-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ` +
                  (isActive
                    ? 'bg-black text-white font-bold shadow'
                    : 'text-black hover:bg-gray-100 hover:text-black')
                }
                end
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 