
export const getEnvVariables = () => {
    // import.meta.env es la forma nativa de Vite de acceder a las variables
    // @ts-ignore
    const env = import.meta.env;
    return {
        VITE_API_URL: env.VITE_API_URL,
        VITE_TOKEN: env.VITE_TOKEN,
        ...env
    }
}