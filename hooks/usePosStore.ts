import { useContext } from 'react';
import { PosContext } from '../store/PosContext';

export const usePosStore = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePosStore must be used within a PosProvider');
  }
  return context;
};