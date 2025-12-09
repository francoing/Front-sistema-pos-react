import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, MapPin, Mail, MoreVertical } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { User, UserRole } from '../../types';
import UserFormModal from '../../components/UserFormModal';

export const UsersPage = () => {
  const { users, saveUser, deleteUser } = usePosStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case 'Superadmin': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cashier': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
        deleteUser(userId);
    }
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  }

  const handleSave = (user: User) => {
    saveUser(user);
    setIsModalOpen(false);
    setEditingUser(null);
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{users.length}</span>
            </div>
            <p className="text-slate-500 text-sm">Gestión de accesos y personal</p>
          </div>
          
          <button 
            onClick={openNewUserModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden md:inline">Nuevo Usuario</span>
            <span className="md:hidden">Nuevo</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               type="text" 
               placeholder="Buscar por nombre o email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
             />
           </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-5 border-b border-slate-100">ID</th>
                  <th className="p-5 border-b border-slate-100">Usuario</th>
                  <th className="p-5 border-b border-slate-100">Rol</th>
                  <th className="p-5 border-b border-slate-100">Sucursales</th>
                  <th className="p-5 border-b border-slate-100 text-center">Estado</th>
                  <th className="p-5 border-b border-slate-100 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="p-5 text-sm font-mono text-slate-400">
                      #{user.id}
                    </td>
                    
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getRoleColor(user.role)}`}>
                        <Shield size={12} />
                        {user.role}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-wrap gap-1.5">
                        {user.branches.map((branch, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100 text-[10px] font-semibold"
                          >
                             <MapPin size={10} />
                             {branch}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className={`inline-block w-3 h-3 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} title={user.status === 'active' ? 'Activo' : 'Inactivo'} />
                    </td>

                    <td className="p-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(user.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="md:hidden p-2 text-slate-400">
                            <MoreVertical size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UserFormModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave}
            userToEdit={editingUser}
        />
      )}
    </div>
  );
};