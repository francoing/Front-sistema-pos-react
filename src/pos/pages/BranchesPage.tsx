import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Building2, MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { Branch } from '../../types';
import BranchFormModal from '../components/BranchFormModal';

export const BranchesPage = () => {
  const { branches, saveBranch, deleteBranch } = usePosStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta sucursal?')) {
      deleteBranch(id);
    }
  };

  const handleSave = (branch: Branch) => {
    saveBranch(branch);
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  const openNewModal = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">Sucursales</h1>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{branches.length}</span>
                </div>
                <p className="text-slate-500 text-sm">Administración de locales y puntos de venta</p>
            </div>
            
            <button 
                onClick={openNewModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
                <Plus size={20} />
                <span>Nueva Sucursal</span>
            </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, dirección o email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-5 border-b border-slate-100">ID / Nombre</th>
                            <th className="p-5 border-b border-slate-100">Dirección</th>
                            <th className="p-5 border-b border-slate-100">Contacto</th>
                            <th className="p-5 border-b border-slate-100 text-center">Principal</th>
                            <th className="p-5 border-b border-slate-100 text-center">Estado</th>
                            <th className="p-5 border-b border-slate-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredBranches.map(branch => (
                            <tr key={branch.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{branch.name}</div>
                                            <div className="text-xs font-mono text-slate-400 mt-0.5">ID: {branch.id}</div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <MapPin size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate max-w-xs">{branch.address}</span>
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div className="space-y-1">
                                        {branch.phone && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Phone size={12} className="text-slate-400" /> {branch.phone}
                                            </div>
                                        )}
                                        {branch.email && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Mail size={12} className="text-slate-400" /> {branch.email}
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    {branch.isMain ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                                            <CheckCircle2 size={12} /> Casa Central
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-400">-</span>
                                    )}
                                </td>

                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                        branch.status === 'active' 
                                            ? 'bg-green-100 text-green-700 border-green-200' 
                                            : 'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                        {branch.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(branch)}
                                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(branch.id)}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                                            title="Eliminar"
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
            
            {filteredBranches.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No se encontraron sucursales.</p>
                </div>
            )}
        </div>
      </div>

      {isModalOpen && (
          <BranchFormModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            branchToEdit={editingBranch}
          />
      )}

    </div>
  );
};