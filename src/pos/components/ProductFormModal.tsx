
import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductFormModalProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: Category.CAFE,
    image: '',
    sku: '',
    stock: 0,
    status: 'active'
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({ ...productToEdit });
    } else {
      setFormData({
        name: '',
        price: 0,
        category: Category.CAFE,
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80',
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        stock: 50,
        status: 'active'
      });
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleRandomImage = () => {
    const terms = ['coffee', 'pastry', 'drink', 'food', 'restaurant'];
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    const randomId = Math.floor(Math.random() * 1000);
    setFormData(prev => ({
        ...prev,
        image: `https://source.unsplash.com/400x400/?${randomTerm}&sig=${randomId}`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const product: Product = {
      id: productToEdit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      price: formData.price!,
      category: formData.category || Category.OTROS,
      image: formData.image || 'https://via.placeholder.com/150',
      sku: formData.sku || 'N/A',
      stock: formData.stock || 0,
      status: formData.status as any || 'active',
      color: 'bg-white' // Default bg
    };

    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
               <h2 className="text-xl font-bold text-slate-800">
                   {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
               </h2>
               <p className="text-sm text-slate-500">Gestión de inventario</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
               <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex gap-6 flex-col md:flex-row">
                    {/* Image Preview */}
                    <div className="w-full md:w-1/3 flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Imagen</label>
                        <div className="aspect-square rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden relative group">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>
                        <input 
                            type="text" 
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="URL de imagen"
                            className="text-xs border border-slate-200 rounded-lg p-2 w-full"
                        />
                        <button 
                            type="button"
                            onClick={handleRandomImage}
                            className="text-xs flex items-center justify-center gap-1 text-indigo-600 font-bold hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                        >
                            <RefreshCw size={12} /> Generar Aleatoria
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nombre del Producto</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                                    placeholder="Ej: Cappuccino Grande"
                                />
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">SKU</label>
                                <input 
                                    type="text" 
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                                    placeholder="COD-001"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Categoría</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                >
                                    {Object.values(Category).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Precio ($)</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Stock</label>
                                <input 
                                    type="number" 
                                    name="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Estado</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            value="active"
                                            checked={formData.status === 'active'}
                                            onChange={handleChange}
                                            className="accent-indigo-600 w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700">Activo (Publicado)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            value="draft"
                                            checked={formData.status === 'draft'}
                                            onChange={handleChange}
                                            className="accent-indigo-600 w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700">Borrador</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
                Cancelar
            </button>
            <button 
                type="submit"
                form="product-form"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                Guardar Producto
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProductFormModal;
