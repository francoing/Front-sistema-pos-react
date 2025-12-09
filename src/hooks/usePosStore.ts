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
    generateAnalysis,
    handleCheckout
} from '../store/posSlice';
import { Product, User } from '../types';

export const usePosStore = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { 
        cart, 
        salesHistory, 
        users, 
        products, 
        geminiAnalysis, 
        isAnalyzing 
    } = useSelector((state: RootState) => state.pos);

    // Wrapper to match previous API expected by components
    const handleCheckoutWrapper = async (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string) => {
        const resultAction = await dispatch(handleCheckout({ method, customer }));
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
        
        // Async Actions
        generateAnalysis: () => dispatch(generateAnalysis(cart)),
        handleCheckout: handleCheckoutWrapper
    };
};