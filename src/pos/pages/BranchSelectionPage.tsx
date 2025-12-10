
import React from 'react';
import { LayoutGrid, MapPin, Building2, ChevronDown, LogOut } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';

// Mock de direcciones para dar realismo (ya que user.branches son solo strings)
const BRANCH_ADDRESSES: Record<string, string> = {
  'Casa Central': 'Av. Alem 1250, San Miguel de Tucumán',
  'Sucursal Norte': 'Av. Siria 2500, San Miguel de Tucumán',
  'Sucursal Sur': 'Av. Colón 800, San Miguel de Tucumán',
  'Sucursal Este': 'Av. Belgrano 2200, San Miguel de Tucumán',
  'Sucursal Oeste': 'Av. Mate de Luna 1800, San Miguel de Tucumán'
};

export const BranchSelectionPage = () => {
  const { user, selectBranch, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Minimal Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
         <div className="flex items-center gap-3">
             <div className="bg-slate-900 text-white p-2 rounded-lg">
                 <LayoutGrid size={20} />
             </div>
             <span className="font-bold text-lg tracking-tight hidden sm:block">NOVAPOS</span>
         </div>
         
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="hidden sm:inline">Hola,</span> {user.name} 
                <ChevronDown size={14} className="text-slate-400" />
             </div>
             <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
             >
                 <LogOut size={20} />
             </button>
         </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
          
          <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Seleccionar Sucursal</h1>
              <p className="text-slate-500">Por favor, selecciona la sucursal en la que deseas trabajar hoy:</p>
          </div>

          <div className="grid gap-4">
              {user.branches.map((branchName, index) => (
                  <button
                    key={index}
                    onClick={() => selectBranch(branchName)}
                    className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left flex items-start gap-4 active:scale-[0.99]"
                  >
                      <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-indigo-50 transition-colors">
                          <Building2 size={24} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                              {branchName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                              <MapPin size={14} className="text-slate-400" />
                              {BRANCH_ADDRESSES[branchName] || 'Dirección no registrada'}
                          </div>
                      </div>
                  </button>
              ))}
          </div>

          <div className="mt-12 text-center">
              <p className="text-xs text-slate-400">
                  ¿No encuentras tu sucursal? Contacta al soporte técnico o a tu supervisor.
              </p>
          </div>

      </div>
    </div>
  );
};
