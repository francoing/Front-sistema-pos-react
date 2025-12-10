



import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Sale, User, Product, GeminiAnalysis, Client, Branch, CashRegister, CashSession } from '../types';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_CLIENTS, MOCK_BRANCHES, MOCK_CASH_REGISTERS, MOCK_CASH_SESSIONS } from '../constants';
import { analyzeCartAndGenerateReceipt } from '../services/geminiService';

// --- State Interface ---
interface PosState {
    cart: CartItem[];
    salesHistory: Sale[];
    users: User[];
    products: Product[];
    clients: Client[];
    branches: Branch[];
    cashRegisters: CashRegister[];
    cashSessions: CashSession[];
    geminiAnalysis: GeminiAnalysis | null;
    isAnalyzing: boolean;
}

// --- Initial State ---
const initialState: PosState = {
    cart: [],
    salesHistory: [],
    users: MOCK_USERS,
    products: MOCK_PRODUCTS,
    clients: MOCK_CLIENTS,
    branches: MOCK_BRANCHES,
    cashRegisters: MOCK_CASH_REGISTERS,
    cashSessions: MOCK_CASH_SESSIONS,
    geminiAnalysis: null,
    isAnalyzing: false,
};

// --- Async Thunks (Side Effects) ---

// 1. Gemini Analysis Thunk
export const generateAnalysis = createAsyncThunk(
    'pos/generateAnalysis',
    async (cart: CartItem[]) => {
        if (cart.length === 0) throw new Error("Cart is empty");
        const analysis = await analyzeCartAndGenerateReceipt(cart);
        return analysis;
    }
);

// 2. Checkout Thunk
export const handleCheckout = createAsyncThunk(
    'pos/checkout',
    async (payload: { method: 'cash' | 'card' | 'transfer' | 'qr', customer: string, clientId?: string }, { getState }) => {
        const state = getState() as { pos: PosState };
        const { cart, geminiAnalysis } = state.pos;

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * 0.16;
        const total = subtotal + tax;

        let finalNote = geminiAnalysis?.thankYouNote;
        if (!finalNote) {
            finalNote = `¡Gracias por tu compra, ${payload.customer}!`;
        }

        const newSale: Sale = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date(),
            items: [...cart],
            subtotal,
            tax,
            total,
            paymentMethod: payload.method,
            customerName: payload.customer || "Cliente General",
            clientId: payload.clientId,
            aiMessage: finalNote
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return newSale;
    }
);

// --- Slice ---
export const posSlice = createSlice({
    name: 'pos',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const existingItem = state.cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({ ...product, quantity: 1 });
            }
            state.geminiAnalysis = null; // Reset analysis on change
        },
        updateQty: (state, action: PayloadAction<{ id: string, delta: number }>) => {
            const { id, delta } = action.payload;
            const item = state.cart.find(i => i.id === id);
            if (item) {
                const newQty = item.quantity + delta;
                if (newQty > 0) {
                    item.quantity = newQty;
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
            state.geminiAnalysis = null;
        },
        deleteSale: (state, action: PayloadAction<string>) => {
            state.salesHistory = state.salesHistory.filter(s => s.id !== action.payload);
        },
        closeDay: (state) => {
            state.salesHistory = [];
        },
        saveUser: (state, action: PayloadAction<User>) => {
            const savedUser = action.payload;
            const index = state.users.findIndex(u => u.id === savedUser.id);
            if (index >= 0) {
                state.users[index] = savedUser;
            } else {
                state.users.unshift(savedUser);
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
        },
        // --- Product / Inventory Management ---
        saveProduct: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const index = state.products.findIndex(p => p.id === product.id);
            if (index >= 0) {
                state.products[index] = product;
            } else {
                state.products.unshift(product);
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        // --- Client / CRM Management ---
        saveClient: (state, action: PayloadAction<Client>) => {
            const client = action.payload;
            const index = state.clients.findIndex(c => c.id === client.id);
            if (index >= 0) {
                state.clients[index] = client;
            } else {
                state.clients.unshift(client);
            }
        },
        deleteClient: (state, action: PayloadAction<string>) => {
            state.clients = state.clients.filter(c => c.id !== action.payload);
        },
        // --- Branch / Sucursales Management ---
        saveBranch: (state, action: PayloadAction<Branch>) => {
            const branch = action.payload;
            const index = state.branches.findIndex(b => b.id === branch.id);
            if (index >= 0) {
                state.branches[index] = branch;
            } else {
                state.branches.unshift(branch);
            }
        },
        deleteBranch: (state, action: PayloadAction<string>) => {
            state.branches = state.branches.filter(b => b.id !== action.payload);
        },
        // --- Cash Registers Management ---
        saveCashRegister: (state, action: PayloadAction<CashRegister>) => {
            const reg = action.payload;
            const index = state.cashRegisters.findIndex(r => r.id === reg.id);
            if (index >= 0) {
                state.cashRegisters[index] = reg;
            } else {
                state.cashRegisters.unshift(reg);
            }
        },
        deleteCashRegister: (state, action: PayloadAction<string>) => {
            state.cashRegisters = state.cashRegisters.filter(r => r.id !== action.payload);
        },
        openAllCashRegisters: (state) => {
            state.cashRegisters.forEach(reg => {
                reg.status = 'open';
            });
        },
        // --- Cash Sessions Management ---
        openCashSession: (state, action: PayloadAction<CashSession>) => {
            state.cashSessions.unshift(action.payload);
            // Also update register status
            const reg = state.cashRegisters.find(r => r.id === action.payload.registerId);
            if (reg) reg.status = 'open';
        },
        closeCashSession: (state, action: PayloadAction<{id: string, finalCash: number}>) => {
             const session = state.cashSessions.find(s => s.id === action.payload.id);
             if (session) {
                 session.status = 'closed';
                 session.finalCash = action.payload.finalCash;
                 session.endTime = new Date();
                 // Update register status
                 const reg = state.cashRegisters.find(r => r.id === session.registerId);
                 if (reg) reg.status = 'closed';
             }
        }
    },
    extraReducers: (builder) => {
        // Handle Generate Analysis
        builder.addCase(generateAnalysis.pending, (state) => {
            state.isAnalyzing = true;
        });
        builder.addCase(generateAnalysis.fulfilled, (state, action) => {
            state.isAnalyzing = false;
            state.geminiAnalysis = action.payload;
        });
        builder.addCase(generateAnalysis.rejected, (state) => {
            state.isAnalyzing = false;
        });

        // Handle Checkout
        builder.addCase(handleCheckout.fulfilled, (state, action) => {
            state.salesHistory.unshift(action.payload);
            state.cart = [];
            state.geminiAnalysis = null;
            
            // Decrease stock
            action.payload.items.forEach(cartItem => {
                const product = state.products.find(p => p.id === cartItem.id);
                if (product && product.stock !== undefined) {
                    product.stock = Math.max(0, product.stock - cartItem.quantity);
                }
            });
        });
    }
});

// Export actions
export const { 
    addToCart, 
    updateQty, 
    removeFromCart, 
    clearCart, 
    deleteSale, 
    closeDay, 
    saveUser, 
    deleteUser,
    saveProduct,
    deleteProduct,
    saveClient,
    deleteClient,
    saveBranch,
    deleteBranch,
    saveCashRegister,
    deleteCashRegister,
    openAllCashRegisters,
    openCashSession,
    closeCashSession
} = posSlice.actions;