import React, { createContext, useState, useEffect } from 'react';
import { Sale, CartItem, User, Product, GeminiAnalysis } from '../types';
import { MOCK_USERS, MOCK_PRODUCTS } from '../constants';
import { analyzeCartAndGenerateReceipt } from '../services/geminiService';

interface PosContextProps {
  // State
  cart: CartItem[];
  salesHistory: Sale[];
  users: User[];
  products: Product[];
  geminiAnalysis: GeminiAnalysis | null;
  isAnalyzing: boolean;

  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  handleCheckout: (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string) => Promise<Sale>;
  handleDeleteSale: (id: string) => void;
  handleCloseDay: () => void;
  
  // Users Actions
  saveUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  // AI Actions
  generateAnalysis: () => Promise<void>;
}

export const PosContext = createContext<PosContextProps>({} as PosContextProps);

export const PosProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Products could be fetched from an API in the future
  const products = MOCK_PRODUCTS;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if (geminiAnalysis) setGeminiAnalysis(null);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setGeminiAnalysis(null);
  };

  const generateAnalysis = async () => {
    if (cart.length === 0) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCartAndGenerateReceipt(cart);
      setGeminiAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCheckout = async (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string): Promise<Sale> => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    let finalNote = geminiAnalysis?.thankYouNote;
    if (!finalNote) {
       finalNote = `¡Gracias por tu compra, ${customer}!`;
    }

    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date(),
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod: method,
      customerName: customer || "Cliente General",
      aiMessage: finalNote
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSalesHistory([newSale, ...salesHistory]);
    clearCart();
    return newSale;
  };

  const handleDeleteSale = (saleId: string) => {
    setSalesHistory(prev => prev.filter(s => s.id !== saleId));
  };

  const handleCloseDay = () => {
    setSalesHistory([]);
  };

  const saveUser = (savedUser: User) => {
    const exists = users.some(u => u.id === savedUser.id);
    if (exists) {
        setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));
    } else {
        setUsers([savedUser, ...users]);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <PosContext.Provider value={{
      cart,
      salesHistory,
      users,
      products,
      geminiAnalysis,
      isAnalyzing,
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