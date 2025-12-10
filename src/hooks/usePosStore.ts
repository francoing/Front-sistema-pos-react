

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { 
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
    generateAnalysis,
    handleCheckout
} from '../store/posSlice';
import { Product, User, Client, Branch } from '../types';

export const usePosStore = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { 
        cart, 
        salesHistory, 
        users, 
        products,
        clients,
        branches,
        geminiAnalysis, 
        isAnalyzing 
    } = useSelector((state: RootState) => state.pos);

    // Wrapper to match previous API expected by components
    const handleCheckoutWrapper = async (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string, clientId?: string) => {
        const resultAction = await dispatch(handleCheckout({ method, customer, clientId }));
        if (handleCheckout.fulfilled.match(resultAction)) {
            return resultAction.payload;
        } else {
            throw new Error("Checkout failed");
        }
    };

    return {
        // State
        cart,
        salesHistory,
        users,
        products,
        clients,
        branches,
        geminiAnalysis,
        isAnalyzing,

        // Actions
        addToCart: (product: Product) => dispatch(addToCart(product)),
        updateQty: (id: string, delta: number) => dispatch(updateQty({ id, delta })),
        removeFromCart: (id: string) => dispatch(removeFromCart(id)),
        clearCart: () => dispatch(clearCart()),
        handleDeleteSale: (id: string) => dispatch(deleteSale(id)),
        handleCloseDay: () => dispatch(closeDay()),
        saveUser: (user: User) => dispatch(saveUser(user)),
        deleteUser: (id: string) => dispatch(deleteUser(id)),
        
        // Product Management
        saveProduct: (product: Product) => dispatch(saveProduct(product)),
        deleteProduct: (id: string) => dispatch(deleteProduct(id)),

        // Client Management
        saveClient: (client: Client) => dispatch(saveClient(client)),
        deleteClient: (id: string) => dispatch(deleteClient(id)),

        // Branch Management
        saveBranch: (branch: Branch) => dispatch(saveBranch(branch)),
        deleteBranch: (id: string) => dispatch(deleteBranch(id)),
        
        // Async Actions
        generateAnalysis: () => dispatch(generateAnalysis(cart)),
        handleCheckout: handleCheckoutWrapper
    };
};