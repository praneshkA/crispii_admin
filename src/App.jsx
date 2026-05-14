import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

import AdminLogin from './components/AdminLogin';

function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      !!localStorage.getItem('adminToken')
    );



  // ================= LOGIN =================

  const handleLogin = () => {

    setIsAuthenticated(true);

  };



  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem('adminToken');

    setIsAuthenticated(false);

  };



  // ================= PROTECTED ROUTE =================

  const ProtectedRoute = ({ children }) => {

    if (!isAuthenticated) {

      return <Navigate to="/login" />;

    }

    return children;

  };



  return (

    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/" />
              : <AdminLogin onLogin={handleLogin} />
          }
        />



        {/* ================= DASHBOARD ================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />



        {/* ================= PRODUCTS ================= */}

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />



        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;