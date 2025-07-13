

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Trades from './pages/Trades';
import Estadisticas from './pages/Estadisticas';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/trades" replace />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
