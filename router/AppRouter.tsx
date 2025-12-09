import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PosRoutes } from '../pos/routes/PosRoutes';

// In the future, this is where we would check for Auth status
// and conditionally render AuthRoutes or PosRoutes

export const AppRouter = () => {
  return (
    <Routes>
      {/* For now, just forward everything to POS Routes */}
      <Route path="/*" element={<PosRoutes />} />
    </Routes>
  );
};