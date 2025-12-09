import React from 'react';
import { LayoutGrid, ShoppingBag, History, PieChart, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../../components/SidebarItem';

export const PosLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active route
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-24 bg-slate-900 flex-col items-center py-6 px-2 flex-shrink-0 z-20">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-900/50">
          <LayoutGrid className="text-white" />
        </div>
        
        <nav className="flex-1 w-full space-y-2">
          <SidebarItem 
            icon={ShoppingBag} 
            label="Venta" 
            isActive={isActive('/')} 
            onClick={() => navigate('/')} 
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
      <div className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 pb-safe-bottom z-30 shrink-0">
         <SidebarItem 
            icon={ShoppingBag} 
            label="Venta" 
            isActive={isActive('/')} 
            onClick={() => navigate('/')} 
            mobile
          />
          <SidebarItem 
            icon={History} 
            label="Historial" 
            isActive={isActive('/history')} 
            onClick={() => navigate('/history')} 
            mobile
          />
          <SidebarItem 
            icon={PieChart} 
            label="Cierre Z" 
            isActive={isActive('/close')} 
            onClick={() => navigate('/close')} 
            mobile
          />
           <SidebarItem 
            icon={Users} 
            label="Usuarios" 
            isActive={isActive('/users')} 
            onClick={() => navigate('/users')} 
            mobile
          />
      </div>
    </div>
  );
};