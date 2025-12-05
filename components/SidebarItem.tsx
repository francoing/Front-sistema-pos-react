import React from 'react';

interface SidebarItemProps {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  mobile?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  mobile = false
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center transition-all duration-200
      ${mobile 
        ? 'flex-col p-2 w-full rounded-lg' 
        : 'flex-col w-full py-4 rounded-xl mb-2'
      }
      ${isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-400 hover:bg-white hover:text-slate-600'
      }
    `}
  >
    <Icon size={mobile ? 20 : 24} className={mobile ? "mb-1" : "mb-1"} />
    <span className="text-[10px] md:text-xs font-medium">{label}</span>
  </button>
);

export default SidebarItem;