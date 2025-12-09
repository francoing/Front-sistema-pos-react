
import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, CheckCircle2, QrCode, Loader2, ArrowLeft } from 'lucide-react';
import { GeminiAnalysis } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string) => void;
  isProcessing: boolean;
  geminiAnalysis: GeminiAnalysis | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  total, 
  onConfirm, 
  isProcessing,
  geminiAnalysis 
}) => {
  const [method, setMethod] = useState<'cash' | 'card' | 'transfer' | 'qr'>('card');
  const [customer, setCustomer] = useState('Consumidor Final');
  
  // States for QR Logic
  const [isQrStep, setIsQrStep] = useState(false);
  const [qrStatus, setQrStatus] = useState<'generating' | 'waiting' | 'approved'>('generating');

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
        setMethod('card');
        setIsQrStep(false);
        setQrStatus('generating');
    }
  }, [isOpen]);

  const handleMethodSelect = (selected: 'cash' | 'card' | 'transfer' | 'qr') => {
    setMethod(selected);
    setIsQrStep(false); // Reset QR view if changing method
  };

  const handleGenerateQR = () => {
    setIsQrStep(true);
    setQrStatus('generating');
    
    // Simulate generation delay
    setTimeout(() => {
        setQrStatus('waiting');
        
        // Simulate "Payment Approved" after 5 seconds
        setTimeout(() => {
            setQrStatus('approved');
            // Auto-close after approval animation
            setTimeout(() => {
                onConfirm('qr', customer);
            }, 1000);
        }, 5000);
    }, 800);
  };

  const getQRUrl = (amount: number) => {
    // Generates a QR code image using a public API for demo purposes
    // In a real app, this would be the Mercado Pago QR string
    const data = `MERCPAGO_POS_FIXED_AMOUNT_${amount.toFixed(2)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}&color=009ee3`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
             {isQrStep && (
                 <button onClick={() => setIsQrStep(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                     <ArrowLeft size={20} className="text-slate-500" />
                 </button>
             )}
             <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {isQrStep ? 'Pago con QR' : 'Finalizar Venta'}
                </h2>
                <p className="text-slate-500 text-sm">
                    {isQrStep ? 'Escanea para pagar' : 'Resumen de transacción'}
                </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
          
          {/* QR View */}
          {isQrStep ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-6">
                  {qrStatus === 'generating' && (
                      <div className="h-64 flex flex-col items-center justify-center space-y-4">
                          <Loader2 size={48} className="text-blue-500 animate-spin" />
                          <p className="text-slate-500 font-medium">Generando QR único...</p>
                      </div>
                  )}

                  {qrStatus === 'waiting' && (
                      <>
                        <div className="relative p-2 bg-white rounded-2xl border-2 border-blue-500 shadow-xl shadow-blue-200">
                            <img 
                                src={getQRUrl(total)} 
                                alt="QR Mercado Pago" 
                                className="w-64 h-64 rounded-xl"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                    <QrCode className="text-blue-500" size={32} />
                                </div>
                            </div>
                        </div>
                        <div className="text-center space-y-1">
                             <p className="text-lg font-bold text-slate-800">Monto: ${total.toFixed(2)}</p>
                             <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                 <Loader2 size={14} className="animate-spin" />
                                 Esperando confirmación...
                             </div>
                        </div>
                      </>
                  )}

                  {qrStatus === 'approved' && (
                       <div className="h-64 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
                           <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                               <CheckCircle2 size={64} className="text-green-600" />
                           </div>
                           <h3 className="text-2xl font-bold text-slate-800">¡Pago Aprobado!</h3>
                       </div>
                  )}
              </div>
          ) : (
            // Standard Payment View
            <>
                {/* AI Insight */}
                {geminiAnalysis && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                        <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                        <div>
                        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Sugerencia IA</p>
                        <p className="text-sm text-indigo-900 leading-relaxed italic">"{geminiAnalysis.upsellSuggestion}"</p>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input 
                        type="text" 
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700 font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Método de Pago</label>
                    <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'cash', label: 'Efectivo', icon: '💵', color: 'border-slate-100 text-slate-600' },
                        { id: 'card', label: 'Tarjeta', icon: '💳', color: 'border-slate-100 text-slate-600' },
                        { id: 'transfer', label: 'Transferencia', icon: '📱', color: 'border-slate-100 text-slate-600' },
                        { id: 'qr', label: 'QR Mercado Pago', icon: '💠', color: 'border-blue-100 text-blue-600 bg-blue-50/50' }
                    ].map((m) => (
                        <button
                        key={m.id}
                        onClick={() => handleMethodSelect(m.id as any)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            method === m.id 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : `${m.color} hover:border-indigo-200`
                        }`}
                        >
                        <span className="text-2xl">{m.icon}</span>
                        <span className="text-sm font-bold">{m.label}</span>
                        </button>
                    ))}
                    </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                    <div className="text-slate-500 text-sm font-medium">Total a Pagar</div>
                    <div className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</div>
                </div>
            </>
          )}
        </div>

        {/* Footer Action Button */}
        <div className="p-4 md:p-6 pt-0 mt-auto">
          {!isQrStep ? (
             <button
                disabled={isProcessing}
                onClick={() => method === 'qr' ? handleGenerateQR() : onConfirm(method, customer)}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                    ${method === 'qr' 
                        ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white disabled:opacity-70 disabled:cursor-not-allowed'
                    }
                `}
             >
                {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : method === 'qr' ? (
                    <>
                        <QrCode size={24} />
                        Generar QR
                    </>
                ) : (
                <>
                    <CheckCircle2 size={24} />
                    Confirmar Pago
                </>
                )}
             </button>
          ) : (
            // Cancel button during QR step
            <button
                onClick={() => {
                    setIsQrStep(false);
                    setQrStatus('generating');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all"
            >
                Cancelar Operación
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
