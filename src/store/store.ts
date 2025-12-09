
import { configureStore } from '@reduxjs/toolkit';
import { posSlice } from './posSlice';
import { authSlice } from './auth/authSlice';

export const store = configureStore({
    reducer: {
        pos: posSlice.reducer,
        auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            // Ignore serializable check for Dates in MOCK data and Sale objects for this demo
            serializableCheck: false
        })
});

// Types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
