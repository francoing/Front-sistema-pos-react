
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { CashRegister, Branch } from '../../types';
import { usePosStore } from '../../hooks/usePosStore';

interface CashRegisterFormModalProps {
  onClose: () => void;
  onSave: (register: CashRegister) => void;
  registerToEdit?: CashRegister | null;
}

const CashRegisterFormModal: React.FC<CashRegisterFormModalProps> = ({ onClose, onSave, registerToEdit }) => {
  const { branches } = usePosStore();
  const [formData, setFormData] = useState<Partial<CashRegister>>({
    name: '',
    branchId: '',
    status: 'closed'
  });

  useEffect(() => {
    if (registerToEdit) {
      setFormData({ ...registerToEdit });
    } else {
      setFormData({
        name: '',
        branchId: branches.length > 0 ? branches[0].id : '',
        status: 'closed'
      });
    }
  }, [registerToEdit, branches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.branchId) return;

    const selectedBranch = branches.find(b => b.id === formData.branchId);

    const register: CashRegister = {
      id: registerToEdit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      branchId: formData.branchId!,
      branchName: selectedBranch ? selectedBranch.name : 'Unknown',
      status: formData.status as 'open' | 'closed',
    };

    onSave(register);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
               <h2 className="text-xl font-bold text-slate-800">
                   {registerToEdit ? 'Editar Caja Registradora' : 'Nueva Caja Registradora'}
               </h2>
               <p className="text-sm text-slate-500">Complete la información requerida</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
               <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="cash-register-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nombre*</label>
                    <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-500"
                        placeholder="Nombre de la caja"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Sucursal*</label>
                    <select 
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                        <option value="">Seleccione una sucursal</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Estado</label>
                    <select 
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                        <option value="closed">Cerrada</option>
                        <option value="open">Abierta</option>
                    </select>
                </div>

            </form>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
                Cancelar
            </button>
            <button 
                type="submit"
                form="cash-register-form"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                Guardar Caja
            </button>
        </div>

      </div>
    </div>
  );
};

export default CashRegisterFormModal;
