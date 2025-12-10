
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Phone, Mail, FileText, UserCircle2 } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { Client } from '../../types';
import ClientFormModal from '../components/ClientFormModal';

export const ClientsPage = () => {
  const { clients, saveClient, deleteClient } = usePosStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.taxId?.includes(searchTerm)
  );

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar cliente?')) {
      deleteClient(id);
    }
  };

  const handleSave = (client: Client) => {
    saveClient(client);
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const openNewModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{clients.length}</span>
                </div>
                <p className="text-slate-500 text-sm">Base de datos de clientes y CRM</p>
            </div>
            
            <button 
                onClick={openNewModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
                <Plus size={20} />
                <span>Nuevo Cliente</span>
            </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, email o DNI..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                />
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-5 border-b border-slate-100">Cliente</th>
                            <th className="p-5 border-b border-slate-100">Contacto</th>
                            <th className="p-5 border-b border-slate-100">Identificación</th>
                            <th className="p-5 border-b border-slate-100">Dirección</th>
                            <th className="p-5 border-b border-slate-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredClients.map(client => (
                            <tr key={client.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <UserCircle2 size={24} />
                                        </div>
                                        <div className="font-bold text-slate-800 text-sm">{client.name}</div>
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    <div className="space-y-1">
                                        {client.phone && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Phone size={12} /> {client.phone}
                                            </div>
                                        )}
                                        {client.email && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Mail size={12} /> {client.email}
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4">
                                    {client.taxId ? (
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                                            <FileText size={12} />
                                            {client.taxId}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-300">-</span>
                                    )}
                                </td>

                                <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                                    {client.address || <span className="text-slate-300">-</span>}
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(client)}
                                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(client.id)}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredClients.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <UserCircle2 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No se encontraron clientes.</p>
                </div>
            )}
        </div>
      </div>

      {isModalOpen && (
          <ClientFormModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            clientToEdit={editingClient}
          />
      )}

    </div>
  );
};
