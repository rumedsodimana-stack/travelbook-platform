import { api } from './api';

export interface POSOrder {
  id: string;
  tableNumber?: string;
  outletId: string;
  status: 'OPEN' | 'CLOSED' | 'VOID';
  items: { name: string; qty: number; price: number; }[];
  total: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description?: string;
}

export interface Outlet {
  id: string;
  name: string;
  type: string;
  isOpen: boolean;
}

export const posService = {
  getOrders: (params?: Record<string, string>) =>
    api.get<POSOrder[]>('/pos/orders', { params }).then(r => r.data),
  getMenuItems: () =>
    api.get<MenuItem[]>('/pos/menu-items').then(r => r.data),
  getOutlets: () =>
    api.get<Outlet[]>('/pos/outlets').then(r => r.data),
  createOrder: (data: Partial<POSOrder>) =>
    api.post<POSOrder>('/pos/orders', data).then(r => r.data),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/pos/orders/${id}`, { status }).then(r => r.data),
};
