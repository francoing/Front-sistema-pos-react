
import React, { useState } from 'react';
import { Search, Plus, Filter, Lock, Unlock, Play, Square } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { useAuthStore } from '../../hooks/useAuthStore';
import { CashSession } from '../../types';
import OpenSessionModal from '../components/OpenSessionModal';

export const CashSessionsPage = () => {
  const { cashSessions, openCashSession, closeCashSession } = usePosStore();
  const { user } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');

  const filteredSessions = cashSessions.filter(s => {
    const matchesSearch = s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.registerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenSession = (session: CashSession) => {
      openCashSession(session);
      setIsModalOpen(false);
  };

  const handleCloseSession = (id: string) => {
      // For demo purposes, we ask for final cash in a prompt. In real app, this would be another modal.
      const finalCashStr = prompt("Ingrese el monto final en caja:");
      if (finalCashStr === null) return;
      
      const finalCash = parseFloat(finalCashStr);
      if (isNaN(finalCash)) {
          alert("Monto inválido");
          return;
      }

      if (window.confirm("¿Confirmar cierre de caja?")) {
          closeCashSession(id, finalCash);
      }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">Sesiones de Caja</h1>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{cashSessions.length}</span>
                </div>
                <p className="text-slate-500 text-sm">Control de aperturas y cierres de turno</p>
            </div>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
                <Plus size={20} />
                <span>Abrir Caja</span>
            </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-500"
                />
            </div>
            
            <div>
                 <select 
                    className="w-full py-2.5 px-3 bg-slate-900 text-white border border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                 >
                     <option value="all">Todos los estados</option>
                     <option value="open">Abiertos</option>
                     <option value="closed">Cerrados</option>
                 </select>
            </div>

             <div>
                 <select className="w-full py-2.5 px-3 bg-slate-900 text-white border border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                     <option value="all">Todas las sucursales</option>
                     {/* In a real app this would be dynamic */}
                 </select>
            </div>
        </div>

        {/* Header Bar for Table */}
        <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider p-3 rounded-t-xl flex items-center justify-between px-6">
             <div className="grid grid-cols-12 w-full gap-4">
                 <div className="col-span-1">ID</div>
                 <div className="col-span-2">Sucursal</div>
                 <div className="col-span-2">Caja</div>
                 <div className="col-span-2">Usuario</div>
                 <div className="col-span-2">Apertura</div>
                 <div className="col-span-2">Monto Inicial</div>
                 <div className="col-span-1 text-center">Estado</div>
             </div>
        </div>

        {/* Content */}
        {filteredSessions.length === 0 ? (
             <div className="bg-slate-900/5 p-12 text-center rounded-b-xl border border-t-0 border-slate-200">
                 <p className="text-slate-500">No hay sesiones de caja registradas</p>
             </div>
        ) : (
             <div className="bg-white border border-t-0 border-slate-200 rounded-b-xl divide-y divide-slate-100">
                 {filteredSessions.map(session => (
                     <div key={session.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors text-sm text-slate-700">
                         <div className="col-span-1 font-mono text-slate-400 text-xs">#{session.id.split('-')[1]}</div>
                         <div className="col-span-2 font-medium">{session.branchName}</div>
                         <div className="col-span-2">{session.registerName}</div>
                         <div className="col-span-2 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                 {session.userName.charAt(0)}
                             </div>
                             {session.userName}
                         </div>
                         <div className="col-span-2 text-xs text-slate-500">
                             {session.startTime.toLocaleDateString()} <br/>
                             {session.startTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                         </div>
                         <div className="col-span-2 font-bold font-mono">
                             ${session.initialCash.toFixed(2)}
                         </div>
                         <div className="col-span-1 text-center">
                             {session.status === 'open' ? (
                                 <button 
                                    onClick={() => handleCloseSession(session.id)}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200 transition-all group"
                                    title="Click para cerrar caja"
                                 >
                                     <span className="group-hover:hidden">Abierto</span>
                                     <span className="hidden group-hover:inline">Cerrar</span>
                                 </button>
                             ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-bold border border-slate-200">
                                     Cerrado
                                 </span>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
        )}

         <div className="mt-4 text-right text-xs text-slate-400">
             Records: {filteredSessions.length}
         </div>
      </div>

      {isModalOpen && (
          <OpenSessionModal 
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleOpenSession}
          />
      )}

    </div>
  );
};
