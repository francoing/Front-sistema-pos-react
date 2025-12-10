
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { startLogin, startLogout, checkAuthToken } from '../store/auth/thunks';
import { clearErrorMessage, onSelectBranch } from '../store/auth/authSlice';

export const useAuthStore = () => {
    const { status, user, selectedBranch, errorMessage } = useSelector((state: RootState) => state.auth);
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

    const selectBranch = (branchName: string) => {
        dispatch(onSelectBranch(branchName));
    }

    const clearError = () => {
        dispatch(clearErrorMessage());
    }

    return {
        // Properties
        status,
        user,
        selectedBranch,
        errorMessage,

        // Methods
        login,
        logout,
        checkAuth,
        selectBranch,
        clearError
    }
}
