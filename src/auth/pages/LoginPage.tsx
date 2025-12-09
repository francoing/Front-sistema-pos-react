
import React, { useEffect, useState } from 'react';
import { Mail, Lock, LayoutGrid, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { AuthLayout } from '../layout/AuthLayout';

export const LoginPage = () => {
  const { login, errorMessage, status, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });

  const [touched, setTouched] = useState(false);

  useEffect(() => {
      if (errorMessage) {
          const timer = setTimeout(() => {
              clearError();
          }, 4000);
          return () => clearTimeout(timer);
      }
  }, [errorMessage, clearError]);

  const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (formData.email.length < 1 || formData.password.length < 1) return;
      
      login(formData.email, formData.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const isAuthenticating = status === 'checking';

  return (
    <AuthLayout title="Bienvenido a NovaPOS">
        <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Logo Icon Floating */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-2xl shadow-lg">
                <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white">
                    <LayoutGrid size={24} />
                </div>
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="ejemplo@novapos.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="••••••"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>
            </div>

            <button 
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isAuthenticating ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Iniciando...
                    </>
                ) : (
                    'Iniciar Sesión'
                )}
            </button>
            
            <div className="text-center mt-6">
                <p className="text-xs text-slate-400">
                    Credenciales demo: <br/>
                    <span className="font-mono text-slate-600">franco.montti.19@gmail.com</span> / <span className="font-mono text-slate-600">123456</span>
                </p>
            </div>
        </form>
    </AuthLayout>
  );
};
