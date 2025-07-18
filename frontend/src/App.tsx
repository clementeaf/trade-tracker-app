

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Trades from './pages/Trades';
import Estadisticas from './pages/Estadisticas';
import Dashboard from './components/organisms/Dashboard';
import { S3Test } from './pages/S3Test';
import { S3TestAlova } from './pages/S3TestAlova';
import { useTrades } from './hooks/useTrades';

const App = () => {
  const { trades } = useTrades();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Trades />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/dashboard" element={<Dashboard trades={trades} />} />
          <Route path="/s3-test" element={<S3Test />} />
          <Route path="/s3-test-alova" element={<S3TestAlova />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
