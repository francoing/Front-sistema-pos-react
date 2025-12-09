
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PosRoutes } from '../pos/routes/PosRoutes';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { useAuthStore } from '../hooks/useAuthStore';
import { CheckingAuth } from '../ui/components/CheckingAuth';

export const AppRouter = () => {
  const { status, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (status === 'checking') {
      return <CheckingAuth />
  }

  return (
    <Routes>
        {status === 'authenticated' 
            ? (
                /* Rutas Privadas (POS) */
                <Route path="/*" element={<PosRoutes />} />
            )
            : (
                /* Rutas Públicas (Auth) */
                <Route path="/auth/*" element={<AuthRoutes />} />
            )
        }
        
        {/* Redirección por defecto si ninguna ruta coincide */}
        <Route path='/*' element={<Navigate to='/auth/login' />} />
    </Routes>
  );
};
