export interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  available: boolean;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  customerNotes: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
  total: number;
  createdAt: Date;
  waiterId: string;
  waiterName: string;
}

export interface Waiter {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  assignedTables: string[];
}

export interface DailyStat {
  date: string;
  sales: number;
  orders: number;
}

export const mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    price: 12.99,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    description: 'Tomate, mozzarella y albahaca fresca',
    available: true
  },
  {
    id: '2',
    name: 'Pasta Carbonara',
    price: 14.50,
    category: 'Pastas',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    description: 'Pasta con salsa carbonara tradicional',
    available: true
  },
  {
    id: '3',
    name: 'Ensalada César',
    price: 9.99,
    category: 'Ensaladas',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    description: 'Lechuga romana, pollo, crutones y aderezo césar',
    available: true
  },
  {
    id: '4',
    name: 'Hamburguesa Clásica',
    price: 11.99,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    description: 'Carne 180g, lechuga, tomate, cebolla y queso',
    available: true
  },
  {
    id: '5',
    name: 'Risotto de Hongos',
    price: 15.99,
    category: 'Pastas',
    image: 'https://images.unsplash.com/photo-1476124369491-c65e9e6e7ae7?w=400',
    description: 'Arroz arborio con hongos variados',
    available: true
  },
  {
    id: '6',
    name: 'Tacos al Pastor',
    price: 10.50,
    category: 'Mexicana',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    description: '3 tacos con carne al pastor, piña y cilantro',
    available: false
  },
  {
    id: '7',
    name: 'Sushi Variado',
    price: 22.99,
    category: 'Japonesa',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    description: '12 piezas de sushi variado',
    available: true
  },
  {
    id: '8',
    name: 'Tiramisú',
    price: 7.50,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    description: 'Postre italiano con café y mascarpone',
    available: true
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    tableId: 'Mesa 5',
    items: [
      { dishId: '1', dishName: 'Pizza Margherita', quantity: 2, price: 12.99 },
      { dishId: '3', dishName: 'Ensalada César', quantity: 1, price: 9.99 }
    ],
    status: 'preparing',
    customerNotes: 'Sin cebolla en la ensalada',
    paymentMethod: 'card',
    total: 35.97,
    createdAt: new Date('2026-04-11T12:30:00'),
    waiterId: 'W1',
    waiterName: 'Carlos López'
  },
  {
    id: 'ORD-002',
    tableId: 'Mesa 2',
    items: [
      { dishId: '2', dishName: 'Pasta Carbonara', quantity: 1, price: 14.50 },
      { dishId: '8', dishName: 'Tiramisú', quantity: 2, price: 7.50 }
    ],
    status: 'pending',
    customerNotes: '',
    paymentMethod: 'cash',
    total: 29.50,
    createdAt: new Date('2026-04-11T13:15:00'),
    waiterId: 'W2',
    waiterName: 'María García'
  },
  {
    id: 'ORD-003',
    tableId: 'Mesa 8',
    items: [
      { dishId: '4', dishName: 'Hamburguesa Clásica', quantity: 3, price: 11.99 }
    ],
    status: 'ready',
    customerNotes: 'Término medio',
    paymentMethod: 'card',
    total: 35.97,
    createdAt: new Date('2026-04-11T13:00:00'),
    waiterId: 'W1',
    waiterName: 'Carlos López'
  },
  {
    id: 'ORD-004',
    tableId: 'Mesa 12',
    items: [
      { dishId: '7', dishName: 'Sushi Variado', quantity: 1, price: 22.99 },
      { dishId: '5', dishName: 'Risotto de Hongos', quantity: 1, price: 15.99 }
    ],
    status: 'delivered',
    customerNotes: '',
    paymentMethod: 'transfer',
    total: 38.98,
    createdAt: new Date('2026-04-11T11:45:00'),
    waiterId: 'W3',
    waiterName: 'Ana Martínez'
  }
];

export const mockWaiters: Waiter[] = [
  {
    id: 'W1',
    name: 'Carlos López',
    status: 'active',
    assignedTables: ['Mesa 1', 'Mesa 5', 'Mesa 8', 'Mesa 9']
  },
  {
    id: 'W2',
    name: 'María García',
    status: 'active',
    assignedTables: ['Mesa 2', 'Mesa 6', 'Mesa 10']
  },
  {
    id: 'W3',
    name: 'Ana Martínez',
    status: 'active',
    assignedTables: ['Mesa 3', 'Mesa 7', 'Mesa 11', 'Mesa 12']
  },
  {
    id: 'W4',
    name: 'Jorge Ramírez',
    status: 'inactive',
    assignedTables: []
  }
];

export const mockDailyStats: DailyStat[] = [
  { date: '2026-04-05', sales: 1245.50, orders: 45 },
  { date: '2026-04-06', sales: 1567.80, orders: 52 },
  { date: '2026-04-07', sales: 1834.20, orders: 61 },
  { date: '2026-04-08', sales: 1456.90, orders: 48 },
  { date: '2026-04-09', sales: 1689.30, orders: 55 },
  { date: '2026-04-10', sales: 1923.40, orders: 64 },
  { date: '2026-04-11', sales: 2145.70, orders: 68 }
];

export const topDishes = [
  { name: 'Pizza Margherita', sales: 145, revenue: 1883.55 },
  { name: 'Pasta Carbonara', sales: 132, revenue: 1914.00 },
  { name: 'Hamburguesa Clásica', sales: 118, revenue: 1414.82 },
  { name: 'Sushi Variado', sales: 89, revenue: 2046.11 },
  { name: 'Risotto de Hongos', sales: 76, revenue: 1215.24 }
];
