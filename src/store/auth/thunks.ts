
import { MOCK_USERS } from '../../constants';
import { onChecking, onLogin, onLogout } from './authSlice';
import { AppDispatch } from '../store';

// Simulación de Login con API
export const startLogin = (email: string, password: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(onChecking());

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Buscar usuario en los Mocks (en un caso real, esto sería una petición axios.post)
        const user = MOCK_USERS.find(u => u.email === email);

        if (!user) {
            return dispatch(onLogout('Credenciales incorrectas'));
        }

        // Aquí validaríamos la contraseña. 
        // Como los mocks no tienen password real, simularemos que si el password es '123456', entra.
        if (password !== '123456') {
            return dispatch(onLogout('Contraseña incorrecta (Intenta: 123456)'));
        }

        if (user.status !== 'active') {
            return dispatch(onLogout('El usuario está inactivo, contacte al administrador'));
        }

        // Guardar token en localStorage (Simulado)
        localStorage.setItem('token', 'token-simulado-abc-123');
        localStorage.setItem('token-init-date', new Date().getTime().toString());

        dispatch(onLogin(user));
    };
};

export const startLogout = () => {
    return (dispatch: AppDispatch) => {
        localStorage.clear();
        dispatch(onLogout(null));
    }
}

export const checkAuthToken = () => {
    return async (dispatch: AppDispatch) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return dispatch(onLogout(null));
        }

        // Simular verificación de token con backend
        // En este caso, simplemente logueamos al primer usuario administrador del mock como ejemplo de persistencia
        const user = MOCK_USERS[0]; 
        dispatch(onLogin(user));
    }
}
