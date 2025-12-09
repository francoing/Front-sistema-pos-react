
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-indigo-600 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                <p className="text-indigo-200 text-sm">Sistema de Punto de Venta Inteligente</p>
            </div>
            
            <div className="p-8 pt-10">
                {children}
            </div>
        </div>
    </div>
  );
};
