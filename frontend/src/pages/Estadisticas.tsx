import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { calculateTradeStats, formatCurrency, formatPercentage } from '../utils/statsUtils';
import { useTrades } from '../hooks/useTrades';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Estadisticas = () => {
  const { trades, loading, error } = useTrades();
  const stats = calculateTradeStats(trades);

  const pieData = Object.entries(stats.tradesByPar).map(([par, count]) => ({
    name: par,
    value: count,
  }));

  const lineData = stats.monthlyStats.map(item => ({
    month: item.month,
    trades: item.trades,
    profit: item.profit,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Estadísticas</h2>
      </div>
      
      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Operaciones</h3>
          <p className="text-3xl font-bold">{stats.totalTrades}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Operaciones Cerradas</h3>
          <p className="text-3xl font-bold">{stats.closedTrades}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Win Rate</h3>
          <p className="text-3xl font-bold text-green-600">{formatPercentage(stats.winRate)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Profit Total</h3>
          <p className={`text-3xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalProfit)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Operaciones por mes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Operaciones por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trades" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de líneas - Profit por mes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Profit por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico circular - Operaciones por par */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Operaciones por Par</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mejor y peor operación */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Mejores Operaciones</h3>
          <div className="space-y-4">
            {stats.bestTrade && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Mejor Operación</h4>
                <p className="text-sm text-green-600">
                  {stats.bestTrade.par} - {formatCurrency((stats.bestTrade as any).profit || 0)}
                </p>
              </div>
            )}
            {stats.worstTrade && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">Peor Operación</h4>
                <p className="text-sm text-red-600">
                  {stats.worstTrade.par} - {formatCurrency((stats.worstTrade as any).profit || 0)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas; 