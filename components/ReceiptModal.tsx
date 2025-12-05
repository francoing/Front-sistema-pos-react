import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Printer, QrCode, Download, Loader2 } from 'lucide-react';
import { Sale } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
  onPrint: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose, onPrint }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        handleDownloadPDF();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || isPrinting) return;
    
    setIsPrinting(true);

    try {
      // 1. Capture the element
      const element = receiptRef.current;
      
      // Wait a moment for any rendering to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow loading cross-origin images
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');

      // 2. Calculate PDF dimensions (Thermal paper style ~80mm width)
      const pdfWidth = 80; 
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 3. Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // 4. Download
      pdf.save(`Ticket-${sale.id}.pdf`);

      // 5. Close modal after brief delay (optional, keeps the flow feeling "done")
      setTimeout(() => {
        onPrint(); 
      }, 1000);

    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsPrinting(false);
      alert("Hubo un error al generar el PDF. Por favor intente de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center max-w-sm w-full h-full max-h-[90vh]">
        
        {/* Receipt Scroll Container */}
        <div 
            className={`
                w-full relative overflow-hidden transition-all ease-in-out flex-1 flex flex-col
                ${isPrinting ? 'opacity-50 pointer-events-none' : 'animate-in slide-in-from-top-10 duration-500'}
            `}
        >
             {/* The Paper itself - REFERENCED for PDF generation */}
             <div 
                ref={receiptRef}
                className="bg-white shadow-2xl w-full flex flex-col overflow-hidden relative"
                style={{ 
                    // Clip path looks cool on screen but can be tricky in PDF. 
                    // We keep it for screen, html2canvas usually handles the box model.
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0 calc(100% - 10px))',
                    paddingBottom: '20px' 
                }}
             >
                {/* Header (Static) */}
                <div className="p-8 pb-4 text-center border-b-2 border-dashed border-slate-200 shrink-0">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                    <LayoutGrid size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">NOVAPOS</h2>
                    <p className="text-xs text-slate-500 font-mono mt-1">Av. Principal 123, Ciudad</p>
                    <p className="text-xs text-slate-500 font-mono">TEL: +55 1234 5678</p>
                    <div className="mt-4 text-xs font-mono text-slate-400">
                    {sale.date.toLocaleDateString()} {sale.date.toLocaleTimeString()}
                    </div>
                </div>

                {/* Items List (Normally scrollable, but we want full height for PDF if possible, though handling overflow in PDF capture implies capturing the scroll view. 
                   For simplicity in this version, we set max-height large enough or let it expand for the PDF capture, but on screen it scrolls.) 
                */}
                <div className="p-8 py-4 space-y-3 font-mono text-sm overflow-y-auto max-h-[40vh] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div className="flex justify-between text-slate-500 text-xs uppercase border-b border-slate-100 pb-2 sticky top-0 bg-white z-10">
                    <span>Desc</span>
                    <span>Total</span>
                    </div>
                    {sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <span className="text-slate-700 pr-4">
                        {item.quantity}x {item.name}
                        </span>
                        <span className="text-slate-900 font-bold whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                    ))}
                </div>

                {/* Totals (Static at bottom of paper) */}
                <div className="p-8 py-4 bg-slate-50 border-t-2 border-dashed border-slate-200 font-mono shrink-0">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Subtotal</span>
                    <span>${sale.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>IVA (16%)</span>
                    <span>${sale.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 border-t border-slate-300 pt-2">
                    <span>TOTAL</span>
                    <span>${sale.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 text-xs text-slate-500 uppercase">
                    Pago: {sale.paymentMethod === 'cash' ? 'Efectivo' : sale.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 uppercase">
                    Cliente: {sale.customerName}
                    </div>
                </div>

                {/* AI Note & Footer (Static) */}
                <div className="shrink-0">
                    {sale.aiMessage && (
                        <div className="px-8 pb-4 text-center">
                        <p className="text-xs italic text-slate-600 font-serif">"{sale.aiMessage}"</p>
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center pt-2 pb-6 opacity-80">
                        <QrCode size={48} className="text-slate-800 mb-2"/>
                        <p className="text-[10px] font-mono text-slate-400">ID: {sale.id}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons (Fixed outside of scroll) */}
        <div className="shrink-0 mt-6 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 z-50">
            <button
                disabled={isPrinting}
                onClick={handleDownloadPDF}
                className="group relative bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white pl-6 pr-8 py-3 rounded-full font-bold shadow-xl shadow-indigo-900/40 hover:shadow-indigo-600/40 transition-all active:scale-95 flex items-center gap-3"
            >
                {isPrinting ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <span className="bg-indigo-700/50 p-1.5 rounded-full">
                        <Printer size={20} />
                    </span>
                )}
                {isPrinting ? 'Generando PDF...' : 'Imprimir / PDF'}
                
                {!isPrinting && (
                    <span className="absolute -right-2 -top-2 bg-white text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-indigo-100">
                        F9
                    </span>
                )}
            </button>
            
            {!isPrinting && (
                <button 
                onClick={onClose} 
                className="text-white/50 hover:text-white text-sm transition-colors"
                >
                Cerrar sin imprimir
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;