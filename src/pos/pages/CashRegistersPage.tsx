
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Monitor, MapPin, Unlock } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { CashRegister } from '../../types';
import CashRegisterFormModal from '../components/CashRegisterFormModal';

export const CashRegistersPage = () => {
  const { cashRegisters, saveCashRegister, deleteCashRegister, openAllCashRegisters } = usePosStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegister, setEditingRegister] = useState<CashRegister | null>(null);

  const filteredRegisters = cashRegisters.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (reg: CashRegister) => {
    setEditingRegister(reg);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta caja registradora?')) {
      deleteCashRegister(id);
    }
  };

  const handleSave = (reg: CashRegister) => {
    saveCashRegister(reg);
    setIsModalOpen(false);
    setEditingRegister(null);
  };

  const openNewModal = () => {
    setEditingRegister(null);
    setIsModalOpen(true);
  };

  const handleOpenAll = () => {
      if (window.confirm("¿Estás seguro de que deseas abrir TODAS las cajas registradoras de todas las sucursales?")) {
          openAllCashRegisters();
      }
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">Cajas Registradoras</h1>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{cashRegisters.length}</span>
                </div>
                <p className="text-slate-500 text-sm">Administración de puntos de cobro</p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={handleOpenAll}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Unlock size={20} />
                    <span>Abrir Todas</span>
                </button>

                <button 
                    onClick={openNewModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Nueva Caja</span>
                </button>
            </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o sucursal..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-5 border-b border-slate-100">ID / Nombre</th>
                            <th className="p-5 border-b border-slate-100">Sucursal</th>
                            <th className="p-5 border-b border-slate-100 text-center">Estado</th>
                            <th className="p-5 border-b border-slate-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRegisters.map((reg) => (
                            <tr key={reg.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            <Monitor size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{reg.name}</div>
                                            <div className="text-xs font-mono text-slate-400 mt-0.5">ID: {reg.id}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <MapPin size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate max-w-xs">{reg.branchName}</span>
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    {reg.status === 'open' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border bg-green-100 text-green-700 border-green-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            Abierta
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border bg-slate-100 text-slate-500 border-slate-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            Cerrada
                                        </span>
                                    )}
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(reg)}
                                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(reg.id)}
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
            
            {filteredRegisters.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No se encontraron cajas registradoras.</p>
                </div>
            )}
        </div>
      </div>

      {isModalOpen && (
          <CashRegisterFormModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            registerToEdit={editingRegister}
          />
      )}

    </div>
  );
};
