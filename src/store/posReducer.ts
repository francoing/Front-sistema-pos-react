import { CartItem, Sale, User, Product, GeminiAnalysis } from '../types';

export interface PosState {
    cart: CartItem[];
    salesHistory: Sale[];
    users: User[];
    products: Product[];
    geminiAnalysis: GeminiAnalysis | null;
    isAnalyzing: boolean;
}

export type PosAction = 
    | { type: '[POS] - Add Product', payload: Product }
    | { type: '[POS] - Update Quantity', payload: { id: string, delta: number } }
    | { type: '[POS] - Remove Product', payload: string }
    | { type: '[POS] - Clear Cart' }
    | { type: '[POS] - Set Analysis', payload: GeminiAnalysis | null }
    | { type: '[POS] - Set Analyzing', payload: boolean }
    | { type: '[POS] - Add Sale', payload: Sale }
    | { type: '[POS] - Delete Sale', payload: string }
    | { type: '[POS] - Clear History' }
    | { type: '[POS] - Save User', payload: User }
    | { type: '[POS] - Delete User', payload: string };

export const posReducer = (state: PosState, action: PosAction): PosState => {
    switch (action.type) {
        case '[POS] - Add Product': {
            const product = action.payload;
            const existing = state.cart.find(item => item.id === product.id);
            
            let newCart;
            if (existing) {
                newCart = state.cart.map(item => 
                    item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            } else {
                newCart = [...state.cart, { ...product, quantity: 1 }];
            }

            return {
                ...state,
                cart: newCart,
                geminiAnalysis: null // Reset analysis on cart change
            };
        }

        case '[POS] - Update Quantity': {
            const { id, delta } = action.payload;
            return {
                ...state,
                cart: state.cart.map(item => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : item;
                    }
                    return item;
                })
            };
        }

        case '[POS] - Remove Product':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            };

        case '[POS] - Clear Cart':
            return {
                ...state,
                cart: [],
                geminiAnalysis: null
            };

        case '[POS] - Set Analysis':
            return {
                ...state,
                geminiAnalysis: action.payload
            };

        case '[POS] - Set Analyzing':
            return {
                ...state,
                isAnalyzing: action.payload
            };

        case '[POS] - Add Sale':
            return {
                ...state,
                salesHistory: [action.payload, ...state.salesHistory],
                cart: [], // Auto clear cart on sale
                geminiAnalysis: null
            };

        case '[POS] - Delete Sale':
            return {
                ...state,
                salesHistory: state.salesHistory.filter(s => s.id !== action.payload)
            };

        case '[POS] - Clear History':
            return {
                ...state,
                salesHistory: []
            };

        case '[POS] - Save User': {
            const savedUser = action.payload;
            const exists = state.users.some(u => u.id === savedUser.id);
            return {
                ...state,
                users: exists 
                    ? state.users.map(u => u.id === savedUser.id ? savedUser : u)
                    : [savedUser, ...state.users]
            };
        }

        case '[POS] - Delete User':
            return {
                ...state,
                users: state.users.filter(u => u.id !== action.payload)
            };

        default:
            return state;
    }
}