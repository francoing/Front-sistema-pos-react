
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PosLayout } from '../layout/PosLayout';
import { CounterPage } from '../pages/CounterPage';
import { HistoryPage } from '../pages/HistoryPage';
import { CloseRegisterPage } from '../pages/CloseRegisterPage';
import { UsersPage } from '../pages/UsersPage';
import { DashboardPage } from '../pages/DashboardPage';

export const PosRoutes = () => {
  return (
    <PosLayout>
      <Routes>
        <Route path="/" element={<CounterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/close" element={<CloseRegisterPage />} />
        <Route path="/users" element={<UsersPage />} />
        
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </PosLayout>
  );
};
