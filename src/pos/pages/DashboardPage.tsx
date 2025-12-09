
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { useAuthStore } from '../../hooks/useAuthStore';
import { Product } from '../../types';

export const DashboardPage = () => {
  const { salesHistory, products } = usePosStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // 1. Security Check: Redirect if not Admin/Superadmin
  useEffect(() => {
    if (user && !['Admin', 'Superadmin'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);

  // 2. Metrics Calculation
  const metrics = useMemo(() => {
    const totalRevenue = salesHistory.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = salesHistory.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Simulate "Yesterday" data for comparison (just math for demo visuals)
    const revenueGrowth = 12.5; 
    
    // Top selling products (calculated from history)
    const productCount: Record<string, number> = {};
    salesHistory.forEach(sale => {
        sale.items.forEach(item => {
            productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
        });
    });
    
    const topProducts = Object.entries(productCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    return { totalRevenue, totalOrders, averageTicket, revenueGrowth, topProducts };
  }, [salesHistory]);

  // 3. Simulated Low Stock Alerts (Randomly pick 3 products)
  const lowStockProducts = useMemo(() => {
      // In a real app, this would check product.stock < min_stock
      return products.slice(0, 3).map(p => ({
          ...p,
          stock: Math.floor(Math.random() * 5) + 1 // Random low stock number
      }));
  }, [products]);

  // 4. Chart Data Generation (Last 7 Days - Simulated based on today's real data)
  const weeklyData = [
      { day: 'Lun', val: 45 },
      { day: 'Mar', val: 60 },
      { day: 'Mié', val: 35 },
      { day: 'Jue', val: 80 },
      { day: 'Vie', val: 70 },
      { day: 'Sáb', val: 95 },
      { day: 'Hoy', val: (metrics.totalRevenue / 10) + 20 } // Dynamic based on current sales scaled down
  ];
  const maxChartVal = Math.max(...weeklyData.map(d => d.val));

  if (!user || !['Admin', 'Superadmin'].includes(user.role)) {
      return null; // Avoid flash of content before redirect
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Panel Ejecutivo</h1>
            <p className="text-slate-500 text-sm">Visión general del negocio y rendimiento</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Revenue */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <DollarSign size={20} />
                    </div>
                    <span className={`flex items-center text-xs font-bold ${metrics.revenueGrowth > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                        {metrics.revenueGrowth > 0 ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                        {metrics.revenueGrowth}%
                    </span>
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ingresos Totales</h3>
                <p className="text-2xl font-bold text-slate-800">${metrics.totalRevenue.toFixed(2)}</p>
            </div>

            {/* Orders */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <ShoppingBag size={20} />
                    </div>
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ventas Realizadas</h3>
                <p className="text-2xl font-bold text-slate-800">{metrics.totalOrders}</p>
            </div>

            {/* Average Ticket */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ticket Promedio</h3>
                <p className="text-2xl font-bold text-slate-800">${metrics.averageTicket.toFixed(2)}</p>
            </div>

            {/* Alerts Count */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <AlertTriangle size={20} />
                    </div>
                    {lowStockProducts.length > 0 && (
                        <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            Atención
                        </span>
                    )}
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Alertas Stock</h3>
                <p className="text-2xl font-bold text-slate-800">{lowStockProducts.length}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Sales Chart (CSS Only) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar size={18} className="text-slate-400"/>
                        Tendencia Semanal
                    </h3>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                    {weeklyData.map((d, i) => {
                        const heightPercent = (d.val / maxChartVal) * 100;
                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex items-end justify-center h-full bg-slate-50 rounded-t-xl overflow-hidden group-hover:bg-indigo-50 transition-colors">
                                     <div 
                                        className="w-full md:w-12 bg-indigo-500 rounded-t-md transition-all duration-500 ease-out group-hover:bg-indigo-600 relative"
                                        style={{ height: `${heightPercent}%` }}
                                     >
                                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                             {d.val.toFixed(0)}
                                         </div>
                                     </div>
                                </div>
                                <span className="text-xs text-slate-500 font-medium mt-3">{d.day}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Top Products & Alerts */}
            <div className="space-y-6">
                
                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Más Vendidos</h3>
                    <div className="space-y-4">
                        {metrics.topProducts.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No hay datos de ventas aún.</p>
                        ) : (
                            metrics.topProducts.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{p.count} un.</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        Alertas de Stock
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    </h3>
                    <div className="space-y-3">
                        {lowStockProducts.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                                <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0">
                                    <img src={p.image} alt="" className="w-full h-full object-cover rounded" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                    <p className="text-xs text-red-600 font-medium">Quedan solo {p.stock} unidades</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
