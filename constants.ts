import { Product, Category } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cappuccino Artesanal',
    price: 4.50,
    category: Category.CAFE,
    image: 'https://picsum.photos/200/200?random=1',
    color: 'bg-amber-100'
  },
  {
    id: '2',
    name: 'Latte Vainilla',
    price: 5.00,
    category: Category.CAFE,
    image: 'https://picsum.photos/200/200?random=2',
    color: 'bg-orange-100'
  },
  {
    id: '3',
    name: 'Espresso Doble',
    price: 3.50,
    category: Category.CAFE,
    image: 'https://picsum.photos/200/200?random=3',
    color: 'bg-stone-100'
  },
  {
    id: '4',
    name: 'Cheesecake de Fresa',
    price: 6.50,
    category: Category.POSTRES,
    image: 'https://picsum.photos/200/200?random=4',
    color: 'bg-pink-100'
  },
  {
    id: '5',
    name: 'Croissant de Mantequilla',
    price: 3.00,
    category: Category.COMIDA,
    image: 'https://picsum.photos/200/200?random=5',
    color: 'bg-yellow-100'
  },
  {
    id: '6',
    name: 'Sandwich Club',
    price: 8.50,
    category: Category.COMIDA,
    image: 'https://picsum.photos/200/200?random=6',
    color: 'bg-green-100'
  },
  {
    id: '7',
    name: 'Jugo de Naranja',
    price: 4.00,
    category: Category.BEBIDAS,
    image: 'https://picsum.photos/200/200?random=7',
    color: 'bg-orange-200'
  },
  {
    id: '8',
    name: 'Brownie con Helado',
    price: 5.50,
    category: Category.POSTRES,
    image: 'https://picsum.photos/200/200?random=8',
    color: 'bg-neutral-200'
  },
  {
    id: '9',
    name: 'Té Matcha Latte',
    price: 5.25,
    category: Category.CAFE,
    image: 'https://picsum.photos/200/200?random=9',
    color: 'bg-emerald-100'
  },
  {
    id: '10',
    name: 'Agua Mineral',
    price: 2.00,
    category: Category.BEBIDAS,
    image: 'https://picsum.photos/200/200?random=10',
    color: 'bg-blue-100'
  }
];
