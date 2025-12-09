
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    user: User | null;
    errorMessage: string | null;
}

const initialState: AuthState = {
    status: 'checking', // 'checking', 'authenticated', 'not-authenticated'
    user: null,
    errorMessage: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        onChecking: (state) => {
            state.status = 'checking';
            state.user = null;
            state.errorMessage = null;
        },
        onLogin: (state, action: PayloadAction<User>) => {
            state.status = 'authenticated';
            state.user = action.payload;
            state.errorMessage = null;
        },
        onLogout: (state, action: PayloadAction<string | null>) => {
            state.status = 'not-authenticated';
            state.user = null;
            state.errorMessage = action.payload || null;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = null;
        }
    }
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;
