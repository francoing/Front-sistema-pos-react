
import React, { useState } from 'react';
import { X, Lock, DollarSign } from 'lucide-react';
import { CashSession, CashRegister } from '../../types';
import { usePosStore } from '../../hooks/usePosStore';
import { useAuthStore } from '../../hooks/useAuthStore';

interface OpenSessionModalProps {
  onClose: () => void;
  onConfirm: (session: CashSession) => void;
}

const OpenSessionModal: React.FC<OpenSessionModalProps> = ({ onClose, onConfirm }) => {
  const { user, selectedBranch } = useAuthStore();
  const { cashRegisters } = usePosStore();
  
  // Filter registers for current branch
  const availableRegisters = cashRegisters.filter(r => 
    r.branchName === selectedBranch && r.status === 'closed'
  );

  const [registerId, setRegisterId] = useState('');
  const [initialCash, setInitialCash] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerId) {
        alert("Seleccione una caja");
        return;
    }

    const selectedRegister = cashRegisters.find(r => r.id === registerId);
    if (!selectedRegister || !user) return;

    const newSession: CashSession = {
        id: `SES-${Math.floor(Math.random() * 10000)}`,
        userId: user.id,
        userName: user.name,
        registerId: selectedRegister.id,
        registerName: selectedRegister.name,
        branchName: selectedBranch || 'Unknown',
        startTime: new Date(),
        initialCash: initialCash,
        status: 'open',
        notes
    };

    onConfirm(newSession);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="border-l-4 border-orange-500 pl-4">
               <h2 className="text-xl font-bold text-slate-800">
                   Apertura De Caja
               </h2>
               <p className="text-sm text-slate-500">Complete la información requerida</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
               <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="open-session-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Caja Registradora*</label>
                        <select 
                            value={registerId}
                            onChange={(e) => setRegisterId(e.target.value)}
                            className="w-full p-3 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            required
                        >
                            <option value="">Seleccione una caja</option>
                            {availableRegisters.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        {availableRegisters.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">No hay cajas cerradas disponibles en esta sucursal.</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Monto Inicial*</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="number" 
                                value={initialCash}
                                onChange={(e) => setInitialCash(parseFloat(e.target.value) || 0)}
                                className="w-full pl-9 pr-3 py-3 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-mono"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Notas de Apertura</label>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none h-24 placeholder:text-slate-600"
                        placeholder="Detalles adicionales de la apertura..."
                    />
                </div>

            </form>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
                <X size={18} />
                Cancelar
            </button>
            <button 
                type="submit"
                form="open-session-form"
                disabled={!registerId}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Lock size={18} />
                Abrir Caja
            </button>
        </div>

      </div>
    </div>
  );
};

export default OpenSessionModal;
