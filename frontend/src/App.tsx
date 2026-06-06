import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Perfil from './pages/Perfil/Perfil';
import Aeronaves from './pages/Aeronaves/Aeronaves';
import Pecas from './pages/Pecas/Pecas';
import Etapas from './pages/Etapas/Etapas';
import Funcionarios from './pages/Funcionarios/Funcionarios';
import Testes from './pages/Testes/Testes';
import Relatorio from './pages/Relatorio/Relatorio';
import styles from './App.module.css';
import Qualidade from './pages/Qualidade/Qualidade';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { usuario } = useAuth();
  
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

function AppRoutes() {
  useEffect(() => {
    const token = localStorage.getItem('@Aerocode:token');
    const usuario = localStorage.getItem('@Aerocode:usuario');
    
    if (token && !usuario) {
      localStorage.removeItem('@Aerocode:token');
    }
  }, []);

  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/perfil" element={<PrivateRoute element={<Perfil />} />} />
        <Route path="/aeronaves" element={<PrivateRoute element={<Aeronaves />} />} />
        <Route path="/pecas" element={<PrivateRoute element={<Pecas />} />} />
        <Route path="/etapas" element={<PrivateRoute element={<Etapas />} />} />
        <Route path="/funcionarios" element={<PrivateRoute element={<Funcionarios />} />} />
        <Route path="/testes" element={<PrivateRoute element={<Testes />} />} />
        <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
        <Route path="/qualidade" element={<PrivateRoute element={<Qualidade />} />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;