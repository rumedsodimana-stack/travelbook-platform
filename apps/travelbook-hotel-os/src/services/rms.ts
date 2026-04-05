import { api } from './api';

export interface PricingRule {
  id: string;
  name: string;
  roomType: string;
  baseRate: number;
  adjustmentType: 'FIXED' | 'PERCENT';
  adjustmentValue: number;
  isActive: boolean;
}

export interface OTAChannel {
  id: string;
  name: string;
  isConnected: boolean;
  inventoryAllocation: number;
  lastSync?: string;
}

export interface RatePlan {
  id: string;
  name: string;
  code: string;
  description?: string;
  baseRate: number;
  mealsIncluded?: string;
}

export const rmsService = {
  getPricingRules: () =>
    api.get<PricingRule[]>('/rms/pricing-rules').then(r => r.data),
  getOTAs: () =>
    api.get<OTAChannel[]>('/channel/otas').then(r => r.data),
  getRatePlans: () =>
    api.get<RatePlan[]>('/channel/rate-plans').then(r => r.data),
  toggleRule: (id: string, isActive: boolean) =>
    api.patch(`/rms/pricing-rules/${id}`, { isActive }).then(r => r.data),
};
