import { useState } from 'react';
import Button from '../atoms/Button';

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  priceFrom?: number;
  priceTo?: number;
  par?: string;
  status?: 'open' | 'closed' | 'all';
  takeProfitFrom?: number;
  takeProfitTo?: number;
  stopLossFrom?: number;
  stopLossTo?: number;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  availablePars: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
  availablePars,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left font-semibold"
        >
          <span>Filtros Avanzados</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Filtros por fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros por precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio desde
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.priceFrom || ''}
                onChange={(e) => handleFilterChange('priceFrom', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio hasta
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.priceTo || ''}
                onChange={(e) => handleFilterChange('priceTo', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros por Take Profit y Stop Loss */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Take Profit desde
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.takeProfitFrom || ''}
                onChange={(e) => handleFilterChange('takeProfitFrom', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Take Profit hasta
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.takeProfitTo || ''}
                onChange={(e) => handleFilterChange('takeProfitTo', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Loss desde
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.stopLossFrom || ''}
                onChange={(e) => handleFilterChange('stopLossFrom', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Loss hasta
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.stopLossTo || ''}
                onChange={(e) => handleFilterChange('stopLossTo', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros por par y estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Par
              </label>
              <select
                value={filters.par || ''}
                onChange={(e) => handleFilterChange('par', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Todos los pares</option>
                {availablePars.map(par => (
                  <option key={par} value={par}>{par}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value as 'open' | 'closed' | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">Todas las operaciones</option>
                <option value="open">Operaciones abiertas</option>
                <option value="closed">Operaciones cerradas</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 