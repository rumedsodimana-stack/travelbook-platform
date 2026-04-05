import { api } from './api';

export interface DailyKPI {
  occupancyRate: number;
  revPAR: number;
  adr: number;
  totalRevenue: number;
  arrivals: number;
  departures: number;
  inHouse: number;
  availableRooms: number;
  goppar?: number;
}

export interface RevenueReport {
  date: string;
  revenue: number;
  rooms: number;
  fb: number;
  other: number;
}

export const analyticsService = {
  getDailyKPI: () =>
    api.get<DailyKPI>('/analytics/kpi/daily').then(r => r.data),
  getRevenueReport: (type = 'revenue', days = 14) =>
    api.get<RevenueReport[]>('/analytics/reports', { params: { type, days } }).then(r => r.data),
  getMultiPropertyDashboard: () =>
    api.get('/multi-property/dashboard').then(r => r.data),
};
