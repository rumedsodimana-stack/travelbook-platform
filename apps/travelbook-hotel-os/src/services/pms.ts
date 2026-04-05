import { api } from './api';

export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'CLEAN' | 'DIRTY' | 'OCCUPIED' | 'OUT_OF_ORDER' | 'INSPECTED';
  floor: number;
  guestName?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  adults: number;
  children: number;
  totalAmount: number;
  source?: string;
}

export interface RoomSummary {
  total: number;
  occupied: number;
  clean: number;
  dirty: number;
  outOfOrder: number;
  available: number;
  occupancyRate: number;
}

export const pmsService = {
  getRooms: (params?: Record<string, string>) =>
    api.get<Room[]>('/pms/rooms', { params }).then(r => r.data),
  getRoomSummary: () =>
    api.get<RoomSummary>('/pms/rooms/summary').then(r => r.data),
  getReservations: (params?: Record<string, string>) =>
    api.get<Reservation[]>('/pms/reservations', { params }).then(r => r.data),
  checkIn: (id: string) =>
    api.post(`/pms/reservations/${id}/check-in`).then(r => r.data),
  checkOut: (id: string) =>
    api.post(`/pms/reservations/${id}/check-out`).then(r => r.data),
  createReservation: (data: Partial<Reservation>) =>
    api.post<Reservation>('/pms/reservations', data).then(r => r.data),
};
