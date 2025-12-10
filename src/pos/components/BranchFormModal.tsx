import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Branch } from '../../types';

interface BranchFormModalProps {
  onClose: () => void;
  onSave: (branch: Branch) => void;
  branchToEdit?: Branch | null;
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({ onClose, onSave, branchToEdit }) => {
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
    isMain: false
  });

  useEffect(() => {
    if (branchToEdit) {
      setFormData({ ...branchToEdit });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        status: 'active',
        isMain: false
      });
    }
  }, [branchToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    const branch: Branch = {
      id: branchToEdit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      address: formData.address!,
      phone: formData.phone || '',
      email: formData.email || '',
      status: formData.status as 'active' | 'inactive',
      isMain: formData.isMain
    };

    onSave(branch);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
               <h2 className="text-xl font-bold text-slate-800">
                   {branchToEdit ? 'Editar Sucursal' : 'Nueva Sucursal'}
               </h2>
               <p className="text-sm text-slate-500">Información del establecimiento</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
               <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="branch-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nombre Sucursal*</label>
                            <input 
                                type="text" 
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                                placeholder="Ej: Sucursal Centro"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dirección*</label>
                            <input 
                                type="text" 
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                placeholder="Calle Principal 123"
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Teléfono</label>
                            <input 
                                type="text" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                placeholder="381-123456"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                placeholder="sucursal@empresa.com"
                            />
                        </div>

                        <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                             <div>
                                <label className="text-sm font-bold text-slate-700 block">¿Es Casa Central?</label>
                                <p className="text-xs text-slate-500">Marcar si esta es la sucursal principal</p>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="isMain"
                                    checked={formData.isMain}
                                    onChange={handleChange}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                             </label>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Estado</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="active"
                                        checked={formData.status === 'active'}
                                        onChange={handleChange}
                                        className="accent-indigo-600 w-4 h-4"
                                    />
                                    <span className="text-sm text-slate-700">Activa</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="inactive"
                                        checked={formData.status === 'inactive'}
                                        onChange={handleChange}
                                        className="accent-indigo-600 w-4 h-4"
                                    />
                                    <span className="text-sm text-slate-700">Inactiva</span>
                                </label>
                            </div>
                        </div>
                    </div>
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
                form="branch-form"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                Guardar Sucursal
            </button>
        </div>

      </div>
    </div>
  );
};

export default BranchFormModal;