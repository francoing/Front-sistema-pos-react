import React, { useReducer } from 'react';
import { PosContext } from './PosContext';
import { posReducer, PosState } from './posReducer';
import { MOCK_USERS, MOCK_PRODUCTS } from '../constants';
import { analyzeCartAndGenerateReceipt } from '../services/geminiService';
import { Product, User, Sale } from '../types';

const INITIAL_STATE: PosState = {
    cart: [],
    salesHistory: [],
    users: MOCK_USERS,
    products: MOCK_PRODUCTS,
    geminiAnalysis: null,
    isAnalyzing: false
}

export const PosProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [state, dispatch] = useReducer(posReducer, INITIAL_STATE);

  const addToCart = (product: Product) => {
    dispatch({ type: '[POS] - Add Product', payload: product });
  };

  const updateQty = (id: string, delta: number) => {
    dispatch({ type: '[POS] - Update Quantity', payload: { id, delta }});
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: '[POS] - Remove Product', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: '[POS] - Clear Cart' });
  };

  const generateAnalysis = async () => {
    if (state.cart.length === 0) return;
    
    dispatch({ type: '[POS] - Set Analyzing', payload: true });
    
    try {
      const analysis = await analyzeCartAndGenerateReceipt(state.cart);
      dispatch({ type: '[POS] - Set Analysis', payload: analysis });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: '[POS] - Set Analyzing', payload: false });
    }
  };

  const handleCheckout = async (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string): Promise<Sale> => {
    const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    let finalNote = state.geminiAnalysis?.thankYouNote;
    if (!finalNote) {
       finalNote = `¡Gracias por tu compra, ${customer}!`;
    }

    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date(),
      items: [...state.cart],
      subtotal,
      tax,
      total,
      paymentMethod: method,
      customerName: customer || "Cliente General",
      aiMessage: finalNote
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    dispatch({ type: '[POS] - Add Sale', payload: newSale });
    
    // Note: The reducer already handles clearing the cart and analysis
    return newSale;
  };

  const handleDeleteSale = (saleId: string) => {
    dispatch({ type: '[POS] - Delete Sale', payload: saleId });
  };

  const handleCloseDay = () => {
    dispatch({ type: '[POS] - Clear History' });
  };

  const saveUser = (savedUser: User) => {
    dispatch({ type: '[POS] - Save User', payload: savedUser });
  };

  const deleteUser = (userId: string) => {
    dispatch({ type: '[POS] - Delete User', payload: userId });
  };

  return (
    <PosContext.Provider value={{
      // State
      cart: state.cart,
      salesHistory: state.salesHistory,
      users: state.users,
      products: state.products,
      geminiAnalysis: state.geminiAnalysis,
      isAnalyzing: state.isAnalyzing,
      
      // Methods
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      handleCheckout,
      handleDeleteSale,
      handleCloseDay,
      saveUser,
      deleteUser,
      generateAnalysis
    }}>
      {children}
    </PosContext.Provider>
  );
};