
import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL, VITE_TOKEN } = getEnvVariables();

const novaApi = axios.create({
    baseURL: VITE_API_URL || 'http://localhost:3000/api', // Fallback por defecto si no hay variable
});

novaApi.interceptors.request.use((config) => {
    if (VITE_TOKEN) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${VITE_TOKEN}`;
    }
  
    return config;
});

export default novaApi;
