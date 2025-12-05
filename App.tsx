import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Search, 
  History,
  ChevronUp,
  ChevronDown,
  FileText,
  Printer
} from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Category, Sale, GeminiAnalysis } from './types';
import { analyzeCartAndGenerateReceipt } from './services/geminiService';

// Import Components
import SidebarItem from './components/SidebarItem';
import ProductCard from './components/ProductCard';
import CartContent from './components/CartContent';
import ReceiptModal from './components/ReceiptModal';
import PaymentModal from './components/PaymentModal';

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

  const handleReprint = (sale: Sale) => {
    setLastCompletedSale(sale);
    setShowReceipt(true);
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
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleReprint(sale)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Ver Ticket / PDF"
                              >
                                <FileText size={18} />
                              </button>
                              <button 
                                onClick={() => handleReprint(sale)}
                                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                                title="Reimprimir"
                              >
                                <Printer size={18} />
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
      
      {/* Receipt Modal (Appears after checkout OR from history) */}
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