import { api } from './api';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  department: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo?: string;
  location?: string;
  createdAt: string;
  dueDate?: string;
}

export interface PMSchedule {
  id: string;
  assetId: string;
  assetName: string;
  frequency: string;
  lastDone?: string;
  nextDue: string;
  assignedTo?: string;
  status: 'UPCOMING' | 'OVERDUE' | 'COMPLETED';
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'OPERATIONAL' | 'NEEDS_ATTENTION' | 'OUT_OF_SERVICE';
  lastMaintenance?: string;
  purchaseDate?: string;
  value?: number;
}

export const bmsService = {
  getWorkOrders: (params?: Record<string, string>) =>
    api.get<WorkOrder[]>('/bms/work-orders', { params }).then(r => r.data),
  getPMSchedules: () =>
    api.get<PMSchedule[]>('/bms/pm-schedules').then(r => r.data),
  getAssets: () =>
    api.get<Asset[]>('/bms/assets').then(r => r.data),
  updateWorkOrderStatus: (id: string, status: string) =>
    api.patch(`/bms/work-orders/${id}`, { status }).then(r => r.data),
};
