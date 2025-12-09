import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => (
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

export default ProductCard;