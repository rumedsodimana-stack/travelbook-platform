import { api } from './api';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  email?: string;
  phone?: string;
  hireDate?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
}

export interface PayrollRun {
  id: string;
  period: string;
  status: 'DRAFT' | 'PROCESSING' | 'PAID';
  totalAmount: number;
  employeeCount: number;
  processedAt?: string;
}

export const hcmService = {
  getStaff: () =>
    api.get<StaffMember[]>('/hcm/staff').then(r => r.data),
  getAttendance: (date?: string) =>
    api.get<AttendanceRecord[]>('/hcm/attendance', { params: { date } }).then(r => r.data),
  getPayrollRuns: () =>
    api.get<PayrollRun[]>('/hcm/payroll-runs').then(r => r.data),
};
