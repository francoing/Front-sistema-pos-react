import React from 'react';
import { usePosStore } from '../../hooks/usePosStore';
import CloseRegister from '../../components/CloseRegister';

export const CloseRegisterPage = () => {
  const { salesHistory, handleCloseDay } = usePosStore();

  return (
    <CloseRegister sales={salesHistory} onCloseDay={handleCloseDay} />
  );
};