import React, { useState, useMemo } from 'react';
import { LayoutGrid, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Category, Sale } from '../../types';
import { usePosStore } from '../../hooks/usePosStore';

import ProductCard from '../../components/ProductCard';
import CartContent from '../../components/CartContent';
import ReceiptModal from '../../components/ReceiptModal';
import PaymentModal from '../../components/PaymentModal';

export const CounterPage = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateQty, 
    removeFromCart, 
    clearCart,
    geminiAnalysis,
    isAnalyzing,
    generateAnalysis,
    handleCheckout
  } = usePosStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  
  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  // Computed
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  const onCheckoutConfirm = async (method: 'cash' | 'card' | 'transfer' | 'qr', customer: string) => {
      const sale = await handleCheckout(method, customer);
      setLastSale(sale);
      setIsPayModalOpen(false);
      setIsMobileCartOpen(false);
      setShowReceipt(true);
  };

  return (
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
                <div className="md:hidden w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                    <LayoutGrid size={18} />
                </div>
            </div>
            
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

        {/* Desktop Cart Section */}
        <div className="hidden lg:flex w-[380px] bg-white border-l border-slate-200 flex-col shadow-2xl z-10 h-full">
            <CartContent 
                cart={cart}
                updateQty={updateQty}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                handleGeminiAnalysis={generateAnalysis}
                isAnalyzing={isAnalyzing}
                geminiAnalysis={geminiAnalysis}
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={() => setIsPayModalOpen(true)}
            />
        </div>

        {/* Mobile Cart Drawer */}
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
                    handleGeminiAnalysis={generateAnalysis}
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

        <PaymentModal 
            isOpen={isPayModalOpen}
            onClose={() => setIsPayModalOpen(false)}
            total={total}
            onConfirm={onCheckoutConfirm}
            isProcessing={false}
            geminiAnalysis={geminiAnalysis}
        />

        {showReceipt && lastSale && (
            <ReceiptModal 
                sale={lastSale}
                onClose={() => setShowReceipt(false)}
                onPrint={() => setShowReceipt(false)}
            />
        )}
    </div>
  );
};