import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Receipt, 
  History,
  Sparkles,
  User,
  CheckCircle2,
  X,
  ChevronUp,
  ChevronDown,
  Printer,
  QrCode
} from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Category, Sale, GeminiAnalysis } from './types';
import { analyzeCartAndGenerateReceipt } from './services/geminiService';

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  mobile = false
}: { 
  icon: any, 
  label: string, 
  isActive: boolean, 
  onClick: () => void,
  mobile?: boolean
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

const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void }> = ({ product, onAdd }) => (
  <div 
    onClick={() => onAdd(product)}
    className="group bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer flex flex-col h-full active:scale-95 duration-150"
  >
    <div className={`aspect-square w-full rounded-xl ${product.color || 'bg-slate-100'} mb-3 overflow-hidden relative`}>
        <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={16} className="text-indigo-600" />
        </div>
    </div>
    <div className="flex-1 flex flex-col justify-between">
        <div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wide">{product.category}</p>
        </div>
        <div className="mt-2 md:mt-3 font-bold text-indigo-600 text-sm md:text-base">
            ${product.price.toFixed(2)}
        </div>
    </div>
  </div>
);

const CartContent = ({ 
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
}: any) => (
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

// --- Receipt Modal Component ---
const ReceiptModal = ({ sale, onClose, onPrint }: { sale: Sale; onClose: () => void; onPrint: () => void }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        handlePrintSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrintSequence = () => {
    setIsPrinting(true);
    // Simulate print delay and sliding animation duration
    setTimeout(() => {
      onPrint(); // Trigger the actual "done" action from parent
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center max-w-sm w-full">
        
        {/* Receipt Paper */}
        <div 
          className={`
            w-full bg-white shadow-2xl relative overflow-hidden transition-all ease-in-out
            ${isPrinting ? 'translate-y-[150%] duration-[2000ms] opacity-0' : 'animate-in slide-in-from-top-10 duration-500'}
          `}
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0 calc(100% - 10px))',
            paddingBottom: '2rem'
          }}
        >
          {/* Header */}
          <div className="p-8 pb-4 text-center border-b-2 border-dashed border-slate-200">
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

          {/* Body */}
          <div className="p-8 py-4 space-y-3 font-mono text-sm">
            <div className="flex justify-between text-slate-500 text-xs uppercase border-b border-slate-100 pb-2">
              <span>Desc</span>
              <span>Total</span>
            </div>
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <span className="text-slate-700">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-slate-900 font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="p-8 py-4 bg-slate-50 border-t-2 border-dashed border-slate-200 font-mono">
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

          {/* AI Note */}
          {sale.aiMessage && (
            <div className="px-8 pb-4 text-center">
              <p className="text-xs italic text-slate-600 font-serif">"{sale.aiMessage}"</p>
            </div>
          )}

          {/* Footer Code */}
          <div className="flex flex-col items-center justify-center pt-4 pb-6 opacity-80">
             <QrCode size={48} className="text-slate-800 mb-2"/>
             <p className="text-[10px] font-mono text-slate-400">ID: {sale.id}</p>
          </div>
        </div>

        {/* Action Button (Hidden when printing/animating) */}
        {!isPrinting && (
          <div className="mt-6 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              onClick={handlePrintSequence}
              className="group relative bg-indigo-600 hover:bg-indigo-500 text-white pl-6 pr-8 py-3 rounded-full font-bold shadow-xl shadow-indigo-900/40 hover:shadow-indigo-600/40 transition-all active:scale-95 flex items-center gap-3"
            >
              <span className="bg-indigo-700/50 p-1.5 rounded-full">
                <Printer size={20} />
              </span>
              Imprimir Ticket
              <span className="absolute -right-2 -top-2 bg-white text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-indigo-100">
                F9
              </span>
            </button>
            <button 
              onClick={onClose} 
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Cerrar sin imprimir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  total, 
  onConfirm, 
  isProcessing,
  geminiAnalysis 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  total: number; 
  onConfirm: (method: 'cash' | 'card' | 'transfer', customer: string) => void;
  isProcessing: boolean;
  geminiAnalysis: GeminiAnalysis | null;
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

// --- Main App Logic ---

export default function App() {
  const [view, setView] = useState<'pos' | 'history'>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  // New States for Receipt Logic
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  
  // Gemini State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysis | null>(null);

  // Computed
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const tax = subtotal * 0.16; // 16% Tax example
  const total = subtotal + tax;

  // Filter Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Reset analysis when cart changes significantly to encourage re-checking
    if (geminiAnalysis) setGeminiAnalysis(null);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    if (cart.length <= 1) setIsMobileCartOpen(false);
  };

  const clearCart = () => {
    setCart([]);
    setGeminiAnalysis(null);
    setIsMobileCartOpen(false);
  };

  const handleGeminiAnalysis = async () => {
    if (cart.length === 0) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCartAndGenerateReceipt(cart);
      setGeminiAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCheckout = async (method: 'cash' | 'card' | 'transfer', customer: string) => {
    // Generate final Gemini note if not already present
    let finalNote = geminiAnalysis?.thankYouNote;
    
    if (!finalNote) {
       // Quick fallback if user didn't click the "magic" button
       finalNote = `¡Gracias por tu compra, ${customer}!`;
    }

    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date(),
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod: method,
      customerName: customer,
      aiMessage: finalNote
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSalesHistory([newSale, ...salesHistory]);
    
    // Instead of just clearing, we set the last sale and open the receipt modal
    setLastCompletedSale(newSale);
    setIsPayModalOpen(false);
    setIsMobileCartOpen(false);
    clearCart(); // We clear the cart data, but keep the sale data in lastCompletedSale
    setShowReceipt(true); // Open the receipt modal
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Sidebar - Hidden on mobile, shown on tablet/desktop */}
      <div className="hidden md:flex w-24 bg-slate-900 flex-col items-center py-6 px-2 flex-shrink-0 z-20">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-900/50">
          <LayoutGrid className="text-white" />
        </div>
        
        <nav className="flex-1 w-full space-y-2">
          <SidebarItem 
            icon={ShoppingBag} 
            label="Venta" 
            isActive={view === 'pos'} 
            onClick={() => setView('pos')} 
          />
          <SidebarItem 
            icon={History} 
            label="Historial" 
            isActive={view === 'history'} 
            onClick={() => setView('history')} 
          />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative flex-col">
        
        {view === 'pos' && (
          <div className="flex h-full">
            {/* Products Section */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
              {/* Header */}
              <header className="px-4 py-4 md:px-8 md:py-6 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center gap-4 sticky top-0 z-10 shadow-sm md:shadow-none">
                <div className="flex justify-between items-center md:block">
                   <div>
                      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Menú</h1>
                      <p className="text-slate-400 text-xs md:text-sm hidden md:block">Selecciona productos</p>
                   </div>
                   {/* Mobile Menu Icon Placeholder (Visual only) */}
                   <div className="md:hidden w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                      <LayoutGrid size={18} />
                   </div>
                </div>
                
                {/* Search - Responsive Full Width */}
                <div className="flex-1 max-w-full md:max-w-2xl md:ml-6">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar producto..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full bg-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </header>

              {/* Categories */}
              <div className="px-4 md:px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
                {['Todos', ...Object.values(Category)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-white text-slate-500 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1 px-4 md:px-8 pt-0 pb-24 md:pb-8 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))}
                </div>
              </div>

              {/* Mobile Sticky Cart Summary Bar */}
              {cart.length > 0 && (
                <div className="lg:hidden absolute bottom-4 left-4 right-4 z-20">
                  <button 
                    onClick={() => setIsMobileCartOpen(true)}
                    className="w-full bg-slate-900 text-white p-4 rounded-xl shadow-xl shadow-slate-900/20 flex justify-between items-center animate-in slide-in-from-bottom-5 duration-300"
                  >
                     <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                          {cart.length}
                        </div>
                        <span className="font-semibold text-sm">Ver Orden Actual</span>
                     </div>
                     <div className="flex items-center gap-2 font-bold text-lg">
                        ${total.toFixed(2)}
                        <ChevronUp size={20} />
                     </div>
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Cart Section (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:flex w-[380px] bg-white border-l border-slate-200 flex-col shadow-2xl z-10 h-full">
              <CartContent 
                cart={cart}
                updateQty={updateQty}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                handleGeminiAnalysis={handleGeminiAnalysis}
                isAnalyzing={isAnalyzing}
                geminiAnalysis={geminiAnalysis}
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={() => setIsPayModalOpen(true)}
              />
            </div>

            {/* Mobile Cart Drawer (Overlay) */}
            {isMobileCartOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
                <div 
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setIsMobileCartOpen(false)}
                />
                <div className="bg-white rounded-t-3xl shadow-2xl w-full h-[85vh] relative flex flex-col animate-in slide-in-from-bottom duration-300">
                  <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 shrink-0" />
                  <button 
                    onClick={() => setIsMobileCartOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500"
                  >
                    <ChevronDown size={20} />
                  </button>
                  <CartContent 
                    cart={cart}
                    updateQty={updateQty}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                    handleGeminiAnalysis={handleGeminiAnalysis}
                    isAnalyzing={isAnalyzing}
                    geminiAnalysis={geminiAnalysis}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                    onCheckout={() => setIsPayModalOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Historial de Ventas</h1>
            
            {salesHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <History size={64} className="mb-4 opacity-20" />
                <p>No hay ventas registradas aún.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="p-4 border-b border-slate-100">ID</th>
                        <th className="p-4 border-b border-slate-100">Cliente</th>
                        <th className="p-4 border-b border-slate-100">Fecha</th>
                        <th className="p-4 border-b border-slate-100">Método</th>
                        <th className="p-4 border-b border-slate-100">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesHistory.map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-sm text-slate-500">#{sale.id}</td>
                          <td className="p-4 font-medium text-slate-800">{sale.customerName}</td>
                          <td className="p-4 text-slate-500 text-sm">{sale.date.toLocaleTimeString()}</td>
                          <td className="p-4">
                             <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                               {sale.paymentMethod === 'cash' ? 'Efectivo' : sale.paymentMethod === 'card' ? 'Tarjeta' : 'Transf.'}
                             </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900">${sale.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 pb-safe-bottom z-30 shrink-0">
         <SidebarItem 
            icon={ShoppingBag} 
            label="Venta" 
            isActive={view === 'pos'} 
            onClick={() => setView('pos')} 
            mobile
          />
          <SidebarItem 
            icon={History} 
            label="Historial" 
            isActive={view === 'history'} 
            onClick={() => setView('history')} 
            mobile
          />
      </div>

      {/* Modals */}
      <PaymentModal 
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        total={total}
        onConfirm={handleCheckout}
        isProcessing={false}
        geminiAnalysis={geminiAnalysis}
      />
      
      {/* Receipt Modal (Appears after checkout) */}
      {showReceipt && lastCompletedSale && (
        <ReceiptModal 
          sale={lastCompletedSale}
          onClose={() => setShowReceipt(false)}
          onPrint={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}