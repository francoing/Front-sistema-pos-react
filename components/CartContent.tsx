import React from 'react';
import { ShoppingBag, Receipt, Trash2, Plus, Minus, CreditCard, Sparkles } from 'lucide-react';
import { CartItem, GeminiAnalysis } from '../types';

interface CartContentProps {
  cart: CartItem[];
  updateQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  handleGeminiAnalysis: () => void;
  isAnalyzing: boolean;
  geminiAnalysis: GeminiAnalysis | null;
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

const CartContent: React.FC<CartContentProps> = ({ 
  cart, 
  updateQty, 
  removeFromCart, 
  clearCart, 
  handleGeminiAnalysis, 
  isAnalyzing, 
  geminiAnalysis, 
  subtotal, 
  tax, 
  total, 
  onCheckout 
}) => (
  <div className="flex flex-col h-full">
    <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Receipt size={20} className="text-indigo-600"/>
        Ticket Actual
      </h2>
      <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
        {cart.length} Ítems
      </div>
    </div>

    {/* Cart Items */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
          <ShoppingBag size={48} className="mb-4 text-slate-300" />
          <p>El carrito está vacío</p>
        </div>
      ) : (
        cart.map((item: CartItem) => (
          <div key={item.id} className="flex gap-3 bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 bg-white">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm truncate pr-2">{item.name}</h4>
                <span className="font-bold text-slate-700">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus size={14}/></button>
                  <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-100 rounded text-indigo-600"><Plus size={14}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Footer / Totals */}
    <div className="p-4 md:p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb- safe-bottom">
      {/* AI Assistant Button */}
      {cart.length > 0 && (
          <button 
          onClick={handleGeminiAnalysis}
          disabled={isAnalyzing}
          className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100 rounded-xl text-indigo-700 text-sm font-semibold transition-all group"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">Analizando...</span>
            ) : (
              <>
                  <Sparkles size={16} className="text-purple-500 group-hover:scale-110 transition-transform" />
                  {geminiAnalysis ? 'Actualizar Análisis' : 'Asistente IA'}
              </>
            )}
          </button>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-slate-500 text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500 text-sm">
          <span>IVA (16%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-900 font-bold text-xl pt-2 border-t border-dashed border-slate-200">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
          <button 
          onClick={clearCart}
          disabled={cart.length === 0}
          className="col-span-1 flex items-center justify-center bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-colors disabled:opacity-50 h-12 md:h-auto"
          >
            <Trash2 size={20} />
          </button>
          <button 
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="col-span-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 md:py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-300/50 transition-all flex items-center justify-center gap-2"
          >
            Cobrar <CreditCard size={20} />
          </button>
      </div>
    </div>
  </div>
);

export default CartContent;