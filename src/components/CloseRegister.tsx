
import React, { useRef, useState } from 'react';
import { Sale } from '../types';
import { DollarSign, CreditCard, Hash, Printer, Lock, AlertTriangle, Loader2, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CloseRegisterProps {
  sales: Sale[];
  onCloseDay: () => void;
}

const CloseRegister: React.FC<CloseRegisterProps> = ({ sales, onCloseDay }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Calculations
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalCash = sales.filter(s => s.paymentMethod === 'cash').reduce((acc, s) => acc + s.total, 0);
  const totalCard = sales.filter(s => s.paymentMethod === 'card').reduce((acc, s) => acc + s.total, 0);
  const totalTransfer = sales.filter(s => s.paymentMethod === 'transfer').reduce((acc, s) => acc + s.total, 0);
  const totalQR = sales.filter(s => s.paymentMethod === 'qr').reduce((acc, s) => acc + s.total, 0);
  
  const ticketAverage = sales.length > 0 ? totalSales / sales.length : 0;

  const handlePrintReport = async () => {
    if (!reportRef.current) return;
    setIsPrinting(true);

    try {
        const element = reportRef.current;
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');

        const pdfWidth = 80;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const dateStr = new Date().toISOString().split('T')[0];
        pdf.save(`Cierre-Z-${dateStr}.pdf`);
    } catch (e) {
        console.error("Error printing Z report", e);
        alert("Error generando el reporte");
    } finally {
        setIsPrinting(false);
    }
  };

  const confirmClose = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar el día? Esto reiniciará el historial de ventas.")) {
        onCloseDay();
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Cierre de Caja (Z)</h1>
                <p className="text-slate-500 text-sm">Resumen financiero del día</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handlePrintReport}
                    disabled={isPrinting || sales.length === 0}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isPrinting ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                    Imprimir Reporte
                </button>
                <button 
                    onClick={confirmClose}
                    disabled={sales.length === 0}
                    className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                    <Lock size={18} />
                    Cerrar Día
                </button>
            </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                    <span className="text-xs font-bold uppercase tracking-wider">Venta Total</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">${totalSales.toFixed(2)}</div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Hash size={20} /></div>
                    <span className="text-xs font-bold uppercase tracking-wider">Transacciones</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{sales.length}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard size={20} /></div>
                    <span className="text-xs font-bold uppercase tracking-wider">Ticket Promedio</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">${ticketAverage.toFixed(2)}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={20} /></div>
                    <span className="text-xs font-bold uppercase tracking-wider">Estado</span>
                </div>
                <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Abierto
                </div>
            </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-800">Desglose por Método de Pago</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
                <div className="p-6 flex flex-col items-center text-center">
                    <span className="text-sm text-slate-500 mb-1">Efectivo</span>
                    <span className="text-2xl font-bold text-slate-800">${totalCash.toFixed(2)}</span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${(totalCash/totalSales || 0)*100}%` }}></div>
                    </div>
                </div>
                <div className="p-6 flex flex-col items-center text-center">
                    <span className="text-sm text-slate-500 mb-1">Tarjeta</span>
                    <span className="text-2xl font-bold text-slate-800">${totalCard.toFixed(2)}</span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(totalCard/totalSales || 0)*100}%` }}></div>
                    </div>
                </div>
                <div className="p-6 flex flex-col items-center text-center">
                    <span className="text-sm text-slate-500 mb-1">Transferencia</span>
                    <span className="text-2xl font-bold text-slate-800">${totalTransfer.toFixed(2)}</span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(totalTransfer/totalSales || 0)*100}%` }}></div>
                    </div>
                </div>
                 <div className="p-6 flex flex-col items-center text-center">
                    <span className="text-sm text-slate-500 mb-1">QR Mercado Pago</span>
                    <span className="text-2xl font-bold text-slate-800">${totalQR.toFixed(2)}</span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(totalQR/totalSales || 0)*100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Hidden Thermal Print Template for Z-Report */}
        <div className="fixed top-0 left-0 pointer-events-none opacity-0">
             <div ref={reportRef} className="w-[380px] bg-white p-6 font-mono text-slate-900">
                <div className="text-center mb-6 border-b border-dashed border-slate-300 pb-4">
                    <h2 className="text-2xl font-bold mb-1">REPORTE Z</h2>
                    <p className="text-sm">CIERRE DE DIA</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date().toLocaleString()}</p>
                </div>

                <div className="space-y-4 mb-6 text-sm">
                    <div className="flex justify-between">
                        <span>VENTAS TOTALES:</span>
                        <span className="font-bold">${totalSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>NO. TRANSACCIONES:</span>
                        <span className="font-bold">{sales.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>TICKET PROMEDIO:</span>
                        <span className="font-bold">${ticketAverage.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mb-6 border-t border-dashed border-slate-300 pt-4">
                    <p className="font-bold text-center mb-2">METODOS DE PAGO</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>EFECTIVO:</span>
                            <span>${totalCash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>TARJETA:</span>
                            <span>${totalCard.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>TRANSFERENCIA:</span>
                            <span>${totalTransfer.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>QR MERCADO PAGO:</span>
                            <span>${totalQR.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center border-t border-slate-900 pt-2 w-3/4 mx-auto">
                    <p className="text-xs">FIRMA CAJERO / SUPERVISOR</p>
                </div>
                
                <div className="mt-4 text-center text-xs text-slate-400">
                    <p>-- FIN DEL REPORTE --</p>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default CloseRegister;
