

import React from 'react';
import { LayoutGrid, ShoppingBag, History, PieChart, Users, LayoutDashboard, Package, Contact, Building2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../../components/SidebarItem';
import { useAuthStore } from '../../hooks/useAuthStore';

export const PosLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'Admin' || user?.role === 'Superadmin';

  // Helper to determine active route
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-24 bg-slate-900 flex-col items-center py-6 px-2 flex-shrink-0 z-20 overflow-y-auto no-scrollbar">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-900/50 shrink-0">
          <LayoutGrid className="text-white" />
        </div>
        
        <nav className="flex-1 w-full space-y-2">
          
          <SidebarItem 
            icon={ShoppingBag} 
            label="Venta" 
            isActive={isActive('/')} 
            onClick={() => navigate('/')} 
          />

          {isAdmin && (
            <>
                <SidebarItem 
                icon={LayoutDashboard} 
                label="Dash" 
                isActive={isActive('/dashboard')} 
                onClick={() => navigate('/dashboard')} 
                />
                
                <SidebarItem 
                icon={Building2} 
                label="Sucursales" 
                isActive={isActive('/branches')} 
                onClick={() => navigate('/branches')} 
                />

                <SidebarItem 
                icon={Package} 
                label="Inventario" 
                isActive={isActive('/products')} 
                onClick={() => navigate('/products')} 
                />
            </>
          )}

          <SidebarItem 
            icon={Contact} 
            label="Clientes" 
            isActive={isActive('/clients')} 
            onClick={() => navigate('/clients')} 
          />

          <SidebarItem 
            icon={History} 
            label="Historial" 
            isActive={isActive('/history')} 
            onClick={() => navigate('/history')} 
          />
          <SidebarItem 
            icon={PieChart} 
            label="Cierre Z" 
            isActive={isActive('/close')} 
            onClick={() => navigate('/close')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Usuarios" 
            isActive={isActive('/users')} 
            onClick={() => navigate('/users')} 
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative flex-col">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 pb-safe-bottom z-30 shrink-0 overflow-x-auto">
         <SidebarItem 
            icon={ShoppingBag} 
            label="Venta" 
            isActive={isActive('/')} 
            onClick={() => navigate('/')} 
            mobile
          />
          
          {isAdmin && (
            <SidebarItem 
                icon={LayoutDashboard} 
                label="Dash" 
                isActive={isActive('/dashboard')} 
                onClick={() => navigate('/dashboard')} 
                mobile
            />
          )}

          <SidebarItem 
            icon={Contact} 
            label="Clientes" 
            isActive={isActive('/clients')} 
            onClick={() => navigate('/clients')} 
            mobile
          />

          <SidebarItem 
            icon={History} 
            label="Historial" 
            isActive={isActive('/history')} 
            onClick={() => navigate('/history')} 
            mobile
          />
          {/* Hidden items on mobile to fit screen, or add more scroll logic */}
      </div>
    </div>
  );
};