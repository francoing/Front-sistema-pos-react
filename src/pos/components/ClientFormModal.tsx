
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Client } from '../../types';

interface ClientFormModalProps {
  onClose: () => void;
  onSave: (client: Client) => void;
  clientToEdit?: Client | null;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ onClose, onSave, clientToEdit }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    taxId: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({ ...clientToEdit });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        taxId: '',
        address: '',
        notes: ''
      });
    }
  }, [clientToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const client: Client = {
      id: clientToEdit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      email: formData.email,
      phone: formData.phone,
      taxId: formData.taxId,
      address: formData.address,
      notes: formData.notes
    };

    onSave(client);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
               <h2 className="text-xl font-bold text-slate-800">
                   {clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
               </h2>
               <p className="text-sm text-slate-500">Información de contacto</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
               <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nombre Completo *</label>
                    <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                        placeholder="Juan Pérez"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Teléfono</label>
                        <input 
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            placeholder="+54 9 11..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">DNI / CUIT</label>
                        <input 
                            type="text" 
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            placeholder="20-12345678-9"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="cliente@email.com"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dirección</label>
                    <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Av. Principal 123"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Notas Internas</label>
                    <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none h-24"
                        placeholder="Preferencias del cliente..."
                    />
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
                form="client-form"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                Guardar Cliente
            </button>
        </div>

      </div>
    </div>
  );
};

export default ClientFormModal;
