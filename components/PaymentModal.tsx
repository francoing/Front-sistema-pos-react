import React, { useState } from 'react';
import { X, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { GeminiAnalysis } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: 'cash' | 'card' | 'transfer', customer: string) => void;
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
  const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('card');
  const [customer, setCustomer] = useState('Consumidor Final');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Finalizar Venta</h2>
            <p className="text-slate-500 text-sm">Resumen de transacción</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
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
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'cash', label: 'Efectivo', icon: '💵' },
                { id: 'card', label: 'Tarjeta', icon: '💳' },
                { id: 'transfer', label: 'Transfer.', icon: '📱' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    method === m.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.icon}</span>
                  <span className="text-xs font-semibold truncate w-full">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-end pt-2">
            <div className="text-slate-500 text-sm font-medium">Total a Pagar</div>
            <div className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</div>
          </div>
        </div>

        <div className="p-4 md:p-6 pt-0 mt-auto">
          <button
            disabled={isProcessing}
            onClick={() => onConfirm(method, customer)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 <CheckCircle2 size={24} />
                 Confirmar Pago
               </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;