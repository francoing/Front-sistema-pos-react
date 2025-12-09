import { createContext } from 'react';
import { Sale, CartItem, User, Product, GeminiAnalysis } from '../types';

export interface PosContextProps {
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