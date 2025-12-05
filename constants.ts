import { Product, Category } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // --- CAFÉ ---
  {
    id: '1',
    name: 'Cappuccino Artesanal',
    price: 4.50,
    category: Category.CAFE,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80',
    color: 'bg-amber-100'
  },
  {
    id: '2',
    name: 'Latte Vainilla',
    price: 5.00,
    category: Category.CAFE,
    image: 'https://images.unsplash.com/photo-1570968992193-6e5c922e5363?auto=format&fit=crop&w=400&q=80',
    color: 'bg-orange-100'
  },
  {
    id: '3',
    name: 'Espresso Doble',
    price: 3.50,
    category: Category.CAFE,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80',
    color: 'bg-stone-100'
  },
  {
    id: '9',
    name: 'Té Matcha Latte',
    price: 5.25,
    category: Category.CAFE,
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=400&q=80',
    color: 'bg-emerald-100'
  },
  {
    id: '11',
    name: 'Mocha Blanco',
    price: 5.75,
    category: Category.CAFE,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&q=80',
    color: 'bg-amber-50'
  },
  {
    id: '12',
    name: 'Cold Brew',
    price: 4.25,
    category: Category.CAFE,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=400&q=80',
    color: 'bg-stone-200'
  },

  // --- POSTRES ---
  {
    id: '4',
    name: 'Cheesecake de Fresa',
    price: 6.50,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3dfcd?auto=format&fit=crop&w=400&q=80',
    color: 'bg-pink-100'
  },
  {
    id: '8',
    name: 'Brownie con Helado',
    price: 5.50,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=400&q=80',
    color: 'bg-neutral-200'
  },
  {
    id: '13',
    name: 'Tarta de Limón',
    price: 5.00,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=400&q=80',
    color: 'bg-yellow-50'
  },
  {
    id: '14',
    name: 'Muffin de Arándanos',
    price: 3.50,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=400&q=80',
    color: 'bg-purple-100'
  },
  {
    id: '15',
    name: 'Galleta Choco Chips',
    price: 2.50,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1499636138143-bd649043ea52?auto=format&fit=crop&w=400&q=80',
    color: 'bg-orange-50'
  },

  // --- COMIDA ---
  {
    id: '5',
    name: 'Croissant Mantequilla',
    price: 3.00,
    category: Category.COMIDA,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    color: 'bg-yellow-100'
  },
  {
    id: '6',
    name: 'Sandwich Club',
    price: 8.50,
    category: Category.COMIDA,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
    color: 'bg-green-100'
  },
  {
    id: '16',
    name: 'Bagel de Salmón',
    price: 9.00,
    category: Category.COMIDA,
    image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=400&q=80',
    color: 'bg-orange-50'
  },
  {
    id: '17',
    name: 'Ensalada César',
    price: 7.50,
    category: Category.COMIDA,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=400&q=80',
    color: 'bg-green-50'
  },
  {
    id: '18',
    name: 'Tostada de Aguacate',
    price: 6.00,
    category: Category.COMIDA,
    image: 'https://images.unsplash.com/photo-1588137372308-15f75323a51d?auto=format&fit=crop&w=400&q=80',
    color: 'bg-green-100'
  },

  // --- BEBIDAS ---
  {
    id: '7',
    name: 'Jugo de Naranja',
    price: 4.00,
    category: Category.BEBIDAS,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
    color: 'bg-orange-200'
  },
  {
    id: '10',
    name: 'Agua Mineral',
    price: 2.00,
    category: Category.BEBIDAS,
    image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=400&q=80',
    color: 'bg-blue-100'
  },
  {
    id: '19',
    name: 'Smoothie Verde',
    price: 5.50,
    category: Category.BEBIDAS,
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=400&q=80',
    color: 'bg-green-200'
  },
  {
    id: '20',
    name: 'Limonada Rosa',
    price: 3.50,
    category: Category.BEBIDAS,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
    color: 'bg-pink-200'
  },
  {
    id: '21',
    name: 'Refresco Cola',
    price: 2.50,
    category: Category.BEBIDAS,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    color: 'bg-red-100'
  },
    {
    id: '22',
    name: 'Agua de Coco',
    price: 3.00,
    category: Category.BEBIDAS,
    image: 'https://images.unsplash.com/photo-1547827800-410a569769da?auto=format&fit=crop&w=400&q=80',
    color: 'bg-stone-50'
  }
];