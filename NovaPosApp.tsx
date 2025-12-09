import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { PosProvider } from './store/PosContext';

export const NovaPosApp = () => {
  return (
    <HashRouter>
      <PosProvider>
        <AppRouter />
      </PosProvider>
    </HashRouter>
  );
};