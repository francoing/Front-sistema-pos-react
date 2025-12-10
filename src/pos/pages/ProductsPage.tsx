
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Package, Tag, AlertTriangle } from 'lucide-react';
import { usePosStore } from '../../hooks/usePosStore';
import { Product, Category } from '../../types';
import ProductFormModal from '../components/ProductFormModal';

export const ProductsPage = () => {
  const { products, saveProduct, deleteProduct } = usePosStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleSave = (product: Product) => {
    saveProduct(product);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto pb-24 h-full relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">Inventario</h1>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{products.length}</span>
                </div>
                <p className="text-slate-500 text-sm">Gestiona tu catálogo de productos y stock</p>
            </div>
            
            <button 
                onClick={openNewModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
                <Plus size={20} />
                <span>Nuevo Producto</span>
            </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o SKU..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[140px]"
                >
                    <option value="All">Todas las Categorías</option>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-5 border-b border-slate-100">Producto</th>
                            <th className="p-5 border-b border-slate-100">SKU / Cat</th>
                            <th className="p-5 border-b border-slate-100">Estado</th>
                            <th className="p-5 border-b border-slate-100">Stock</th>
                            <th className="p-5 border-b border-slate-100">Precio</th>
                            <th className="p-5 border-b border-slate-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{product.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 md:hidden">SKU: {product.sku || 'N/A'}</div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit">
                                            {product.sku || 'N/A'}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-600">
                                            {product.category}
                                        </div>
                                    </div>
                                </td>

                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                        product.status === 'active' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                        {product.status === 'active' ? 'Publicado' : 'Borrador'}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${(product.stock || 0) < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                                            {product.stock || 0}
                                        </span>
                                        {(product.stock || 0) < 10 && (
                                            <div className="group/tooltip relative">
                                                <AlertTriangle size={16} className="text-red-500" />
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                    Stock Bajo
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${(product.stock || 0) < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${Math.min(100, ((product.stock || 0) / 100) * 100)}%` }}
                                        ></div>
                                    </div>
                                </td>

                                <td className="p-4 font-bold text-slate-800">
                                    ${product.price.toFixed(2)}
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                                            title="Eliminar"
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
            
            {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No se encontraron productos.</p>
                </div>
            )}
        </div>
      </div>

      {isModalOpen && (
          <ProductFormModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            productToEdit={editingProduct}
          />
      )}

    </div>
  );
};
