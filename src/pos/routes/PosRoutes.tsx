
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PosLayout } from '../layout/PosLayout';
import { CounterPage } from '../pages/CounterPage';
import { HistoryPage } from '../pages/HistoryPage';
import { CloseRegisterPage } from '../pages/CloseRegisterPage';
import { UsersPage } from '../pages/UsersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ClientsPage } from '../pages/ClientsPage';
import { BranchSelectionPage } from '../pages/BranchSelectionPage';
import { useAuthStore } from '../../hooks/useAuthStore';

export const PosRoutes = () => {
  const { selectedBranch } = useAuthStore();

  // Middleware Logic:
  // Si no hay sucursal seleccionada, mostramos SÓLO la página de selección.
  // Esto previene que se cargue el Sidebar/Layout principal.
  if (!selectedBranch) {
      return <BranchSelectionPage />;
  }

  // Si hay sucursal, cargamos el sistema completo con el Layout
  return (
    <PosLayout>
      <Routes>
        <Route path="/" element={<CounterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/close" element={<CloseRegisterPage />} />
        <Route path="/users" element={<UsersPage />} />
        
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </PosLayout>
  );
};
