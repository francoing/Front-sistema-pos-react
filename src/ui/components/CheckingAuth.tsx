
import React from 'react';
import { LayoutGrid, Loader2 } from 'lucide-react';

export const CheckingAuth = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 animate-pulse">
                <LayoutGrid size={32} className="text-white" />
            </div>
            <div className="flex items-center gap-2 text-indigo-800 font-semibold">
                <Loader2 size={20} className="animate-spin" />
                <span>Verificando sesión...</span>
            </div>
        </div>
    </div>
  );
};
