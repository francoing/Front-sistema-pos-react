
import React, { useState, useMemo } from 'react';
import { Search, History, Filter, FileText, Printer, Trash2 } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { Sale } from '../../types';
import ReceiptModal from '../../components/ReceiptModal';

export const HistoryPage = () => {
  const { salesHistory, handleDeleteSale } = usePosStore();
  const [historyQuery, setHistoryQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredHistory = useMemo(() => {
    if (!historyQuery) return salesHistory;
    const query = historyQuery.toLowerCase();
    return salesHistory.filter(sale => 
      sale.customerName?.toLowerCase().includes(query) || 
      sale.id.toLowerCase().includes(query)
    );
  }, [salesHistory, historyQuery]);

  const handleReprint = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
  };

  const onDelete = (saleId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comprobante? Esta acción afectará el cierre de caja.')) {
        handleDeleteSale(saleId);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Historial de Ventas</h1>
                <p className="text-slate-500 text-sm mt-1">
                Mostrando {filteredHistory.length} comprobantes (${filteredHistory.reduce((acc, s) => acc + s.total, 0).toFixed(2)})
                </p>
            </div>
            
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                type="text" 
                placeholder="Buscar cliente o ID de ticket..." 
                value={historyQuery}
                onChange={(e) => setHistoryQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm"
                />
                {historyQuery && (
                <button 
                    onClick={() => setHistoryQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    <Filter size={14} className="opacity-50" />
                </button>
                )}
            </div>
        </div>
        
        {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
            <History size={64} className="mb-4 opacity-20" />
            <p className="font-medium">No se encontraron comprobantes.</p>
            {historyQuery && <p className="text-sm mt-2 opacity-70">Intenta con otro término de búsqueda.</p>}
            </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                    <th className="p-4 border-b border-slate-100">ID</th>
                    <th className="p-4 border-b border-slate-100">Cliente</th>
                    <th className="p-4 border-b border-slate-100">Fecha</th>
                    <th className="p-4 border-b border-slate-100">Método</th>
                    <th className="p-4 border-b border-slate-100">Total</th>
                    <th className="p-4 border-b border-slate-100 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-sm text-slate-500">#{sale.id}</td>
                        <td className="p-4 font-medium text-slate-800">
                            {sale.customerName}
                        </td>
                        <td className="p-4 text-slate-500 text-sm">{sale.date.toLocaleDateString()} {sale.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                            ${sale.paymentMethod === 'qr' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}
                            `}>
                            {sale.paymentMethod === 'cash' ? 'Efectivo' : 
                            sale.paymentMethod === 'card' ? 'Tarjeta' : 
                            sale.paymentMethod === 'qr' ? 'QR' : 'Transf.'}
                            </span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">${sale.total.toFixed(2)}</td>
                        <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                            onClick={() => handleReprint(sale)}
                            className="p-2 bg-slate-100 text-indigo-600 hover:bg-slate-200 rounded-lg transition-colors shadow-sm"
                            title="Ver Ticket / PDF"
                            >
                            <FileText size={18} />
                            </button>
                            <button 
                            onClick={() => handleReprint(sale)}
                            className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors shadow-sm"
                            title="Reimprimir"
                            >
                            <Printer size={18} />
                            </button>
                            <button 
                            onClick={() => onDelete(sale.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                            title="Eliminar Comprobante"
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
            </div>
        )}

        {showReceipt && selectedSale && (
            <ReceiptModal 
                sale={selectedSale}
                onClose={() => setShowReceipt(false)}
                onPrint={() => setShowReceipt(false)}
            />
        )}
    </div>
  );
};
