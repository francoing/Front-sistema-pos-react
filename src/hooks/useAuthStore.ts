
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { startLogin, startLogout, checkAuthToken } from '../store/auth/thunks';
import { clearErrorMessage } from '../store/auth/authSlice';

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const login = (email: string, pass: string) => {
        dispatch(startLogin(email, pass));
    }

    const logout = () => {
        dispatch(startLogout());
    }

    const checkAuth = () => {
        dispatch(checkAuthToken());
    }

    const clearError = () => {
        dispatch(clearErrorMessage());
    }

    return {
        // Properties
        status,
        user,
        errorMessage,

        // Methods
        login,
        logout,
        checkAuth,
        clearError
    }
}
