import React, { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';
import { AVAILABLE_BRANCHES } from '../constants';
import { User, UserRole } from '../types';

interface UserFormModalProps {
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ onClose, onSave, userToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Cashier' as UserRole,
  });

  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set());

  // Initialize form if editing, OR reset if creating new
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '', // Don't pre-fill password for security
        confirmPassword: '',
        role: userToEdit.role,
      });
      setSelectedBranches(new Set(userToEdit.branches));
    } else {
      // RESET FORM for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Cashier',
      });
      setSelectedBranches(new Set());
    }
  }, [userToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleBranch = (branch: string) => {
    const newSelection = new Set(selectedBranches);
    if (newSelection.has(branch)) {
      newSelection.delete(branch);
    } else {
      newSelection.add(branch);
    }
    setSelectedBranches(newSelection);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Por favor complete el nombre y el email');
      return;
    }

    // Password validation logic
    if (userToEdit) {
        // Edit mode: Password is optional (only validate if user typed something)
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
    } else {
        // Create mode: Password is mandatory
        if (!formData.password) {
            alert('La contraseña es obligatoria para nuevos usuarios');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
    }

    const newUser: User = {
      id: userToEdit ? userToEdit.id : Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      branches: Array.from(selectedBranches),
      status: userToEdit ? userToEdit.status : 'active',
      // Generate avatar only if new, otherwise keep existing
      avatar: userToEdit ? userToEdit.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };

    onSave(newUser);
  };

  const ROLES: UserRole[] = ['Superadmin', 'Admin', 'Cashier'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-2">
            <div className="flex justify-between items-start">
                <div className="border-l-4 border-indigo-600 pl-4">
                    <h2 className="text-xl font-bold text-slate-800">
                      {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {userToEdit ? 'Modifique la información necesaria' : 'Complete la información requerida'}
                    </p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Nombre*</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nombre completo"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                </div>
                <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Email*</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                </div>
                <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      {userToEdit ? 'Contraseña (Opcional)' : 'Contraseña*'}
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={userToEdit ? "Dejar vacía para mantener" : "Contraseña"}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                </div>
                <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                       {userToEdit ? 'Confirmar (Opcional)' : 'Confirmar Contraseña'}
                    </label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirmar contraseña"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            {/* Roles */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Roles*</label>
                <div className="flex flex-wrap gap-4">
                    {ROLES.map(role => (
                        <label key={role} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.role === role ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value={role} 
                                    checked={formData.role === role}
                                    onChange={() => setFormData({...formData, role})}
                                    className="hidden" 
                                />
                                {formData.role === role && <Check size={14} className="text-white" />}
                            </div>
                            <span className={`text-sm ${formData.role === role ? 'text-indigo-900 font-semibold' : 'text-slate-600'}`}>{role}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Branches Table */}
            <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500 uppercase">Sucursales*</label>
                 <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-3 w-16 text-center">Seleccionar</th>
                                <th className="p-3">Sucursal</th>
                                <th className="p-3 text-center">¿Es Gerente?</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {AVAILABLE_BRANCHES.map((branch, idx) => {
                                const isSelected = selectedBranches.has(branch);
                                return (
                                    <tr key={idx} className={`transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => toggleBranch(branch)}
                                                className={`w-5 h-5 rounded border mx-auto flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}
                                            >
                                                {isSelected && <Check size={14} className="text-white" />}
                                            </button>
                                        </td>
                                        <td className="p-3 text-sm font-medium text-slate-700">
                                            {branch}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="w-5 h-5 rounded border border-slate-300 bg-white mx-auto cursor-pointer"></div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                 </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
                Cancelar
            </button>
            <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                {userToEdit ? 'Actualizar' : 'Guardar'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default UserFormModal;