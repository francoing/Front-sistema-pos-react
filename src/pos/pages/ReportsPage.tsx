
import React, { useState, useMemo, useRef } from 'react';
import { 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    Download, 
    FileSpreadsheet, 
    Calendar, 
    DollarSign, 
    ShoppingBag, 
    Package,
    Building2,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- Components for Charts (CSS Only to avoid heavy libs) ---

const SimpleBarChart = ({ data, color = "bg-indigo-500" }: { data: { label: string, value: number }[], color?: string }) => {
    const maxValue = Math.max(...data.map(d => d.value)) || 1;
    return (
        <div className="flex items-end gap-2 h-48 w-full">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-slate-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <div 
                            className={`w-full ${color} rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-80`}
                            style={{ height: `${(d.value / maxValue) * 100}%` }}
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {d.value}
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

const SimpleDonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const total = data.reduce((a, b) => a + b.value, 0) || 1;
    let accumulatedDeg = 0;

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full shrink-0" 
                style={{ 
                    background: `conic-gradient(${data.map(d => {
                        const deg = (d.value / total) * 360;
                        const str = `${d.color} ${accumulatedDeg}deg ${accumulatedDeg + deg}deg`;
                        accumulatedDeg += deg;
                        return str;
                    }).join(', ')})`
                }}
            >
                {/* Inner white circle for donut effect */}
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">Total<br/>{total}</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-slate-600 font-medium">{d.label}</span>
                        <span className="text-slate-400 ml-auto">({Math.round((d.value/total)*100)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const ReportsPage = () => {
  const { salesHistory, products, branches } = usePosStore();
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'branches'>('general');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // --- CALCULATIONS ---

  const metrics = useMemo(() => {
    const totalRevenue = salesHistory.reduce((acc, s) => acc + s.total, 0);
    const totalTransactions = salesHistory.length;
    const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Simulate stock value
    const stockValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

    // Sales by Day (Simulated based on IDs or Dates)
    const salesByDay = salesHistory.reduce((acc, s) => {
        const day = s.date.toLocaleDateString('es-ES', { weekday: 'short' });
        acc[day] = (acc[day] || 0) + s.total;
        return acc;
    }, {} as Record<string, number>);
    
    // Fill missing days for chart consistency
    const daysOrder = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
    const chartDataSales = daysOrder.map(d => ({ label: d, value: salesByDay[d] || Math.floor(Math.random() * 500) })); // Random filler for demo

    // Sales by Category
    const categoryCount: Record<string, number> = {};
    salesHistory.forEach(s => s.items.forEach(i => {
        categoryCount[i.category] = (categoryCount[i.category] || 0) + i.quantity;
    }));
    const chartDataCategory = Object.entries(categoryCount).map(([k, v], i) => ({
        label: k, 
        value: v,
        color: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][i % 5]
    }));

    // Top Products
    const productSales: Record<string, {name: string, qty: number, revenue: number}> = {};
    salesHistory.forEach(s => s.items.forEach(i => {
        if (!productSales[i.id]) productSales[i.id] = { name: i.name, qty: 0, revenue: 0 };
        productSales[i.id].qty += i.quantity;
        productSales[i.id].revenue += (i.price * i.quantity);
    }));
    const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // Sales by Branch (Simulated distribution)
    const branchSales = branches.map(b => ({
        name: b.name,
        revenue: totalRevenue * (Math.random() * (0.3 - 0.1) + 0.1), // Random share
        txs: Math.floor(totalTransactions * (Math.random() * (0.3 - 0.1) + 0.1))
    })).sort((a,b) => b.revenue - a.revenue);

    return { totalRevenue, totalTransactions, avgTicket, stockValue, chartDataSales, chartDataCategory, topProducts, branchSales };
  }, [salesHistory, products, branches]);


  // --- EXPORT FUNCTIONS ---

  const handleExportPDF = async () => {
      if (!reportRef.current) return;
      setIsExportingPdf(true);
      try {
          const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#f8fafc' });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('Reporte_NovaPOS.pdf');
      } catch (error) {
          console.error("PDF Export failed", error);
      } finally {
          setIsExportingPdf(false);
      }
  };

  const handleExportCSV = () => {
      // Create CSV content for Products as example
      const header = "Producto,Cantidad Vendida,Ingresos Generados\n";
      const rows = metrics.topProducts.map(p => `${p.name},${p.qty},${p.revenue.toFixed(2)}`).join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + header + rows;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "reporte_ventas.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Reportes y Analítica</h1>
                <p className="text-slate-500 text-sm">Métricas clave para la toma de decisiones</p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                >
                    <FileSpreadsheet size={18} className="text-green-600" />
                    <span>Excel</span>
                </button>
                <button 
                    onClick={handleExportPDF}
                    disabled={isExportingPdf}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
                >
                    {isExportingPdf ? <Loader2 size={18} className="animate-spin"/> : <Download size={18} />}
                    <span>PDF</span>
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
            {[
                { id: 'general', label: 'General', icon: BarChart3 },
                { id: 'products', label: 'Productos', icon: Package },
                { id: 'branches', label: 'Sucursales', icon: Building2 },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id 
                            ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white'
                    }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Report Content Container (Ref for PDF) */}
        <div ref={reportRef} className="space-y-6 bg-slate-50 p-1"> {/* p-1 prevents margin collapse in PDF capture */}
            
            {/* KPI Cards (Always Visible or dependent on tab) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign size={20} /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUpRight size={12}/> +12%
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ventas Netas</p>
                    <p className="text-2xl font-bold text-slate-800">${metrics.totalRevenue.toFixed(2)}</p>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={20} /></div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Transacciones</p>
                    <p className="text-2xl font-bold text-slate-800">{metrics.totalTransactions}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={20} /></div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ticket Promedio</p>
                    <p className="text-2xl font-bold text-slate-800">${metrics.avgTicket.toFixed(2)}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Package size={20} /></div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Valor Stock</p>
                    <p className="text-2xl font-bold text-slate-800">${metrics.stockValue.toLocaleString()}</p>
                </div>
            </div>

            {/* TAB CONTENT */}
            
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar size={18} className="text-slate-400"/> Ventas por Día (Semanal)
                        </h3>
                        <SimpleBarChart data={metrics.chartDataSales} />
                    </div>

                    {/* Category Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <PieChart size={18} className="text-slate-400"/> Ventas por Categoría
                        </h3>
                        <div className="flex justify-center">
                            <SimpleDonutChart data={metrics.chartDataCategory} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Productos con Mayor Rotación</h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Top 5</span>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4 text-center">Unidades Vendidas</th>
                                <th className="p-4 text-right">Ingresos Totales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {metrics.topProducts.map((p, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-700 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                                        {p.name}
                                    </td>
                                    <td className="p-4 text-center font-bold text-slate-800">{p.qty}</td>
                                    <td className="p-4 text-right text-slate-600">${p.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                            {metrics.topProducts.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-400">No hay datos suficientes</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'branches' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Rendimiento por Sucursal</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Sucursal</th>
                                <th className="p-4 text-center">Transacciones</th>
                                <th className="p-4 text-right">Facturación</th>
                                <th className="p-4 text-right">% del Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {metrics.branchSales.map((b, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-700">{b.name}</td>
                                    <td className="p-4 text-center text-slate-600">{b.txs}</td>
                                    <td className="p-4 text-right font-bold text-emerald-600">${b.revenue.toFixed(2)}</td>
                                    <td className="p-4 text-right text-xs text-slate-500">
                                        {((b.revenue / metrics.totalRevenue) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
