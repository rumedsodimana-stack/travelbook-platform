import { api } from './api';

export interface HKTask {
  id: string;
  roomNumber: string;
  type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
  createdAt: string;
}

export interface LostFound {
  id: string;
  description: string;
  location: string;
  foundBy: string;
  status: 'FOUND' | 'CLAIMED' | 'DISPOSED';
  foundDate: string;
}

export const housekeepingService = {
  getTasks: () =>
    api.get<HKTask[]>('/bms/work-orders', { params: { department: 'HOUSEKEEPING' } }).then(r => r.data),
  getLostFound: () =>
    api.get<LostFound[]>('/security/incidents', { params: { type: 'LOST_FOUND' } }).then(r => r.data),
  getInventory: () =>
    api.get('/procurement/inventory').then(r => r.data),
  updateTaskStatus: (id: string, status: string) =>
    api.patch(`/bms/work-orders/${id}`, { status }).then(r => r.data),
};
