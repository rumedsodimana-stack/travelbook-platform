import { Timestamp } from 'firebase/firestore';

export type VehicleType = 'Car' | 'Van' | 'Bus' | 'Motorcycle';
export type VehicleStatus = 'Pending' | 'Verified' | 'Rejected';
export type RideStatus = 'Open' | 'Accepted' | 'Completed' | 'Cancelled';

export interface Vehicle {
  id?: string;
  providerId: string;
  type: VehicleType;
  make?: string;
  model: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  capacity: number;
  photoUrl?: string;
  status: VehicleStatus;
  createdAt: Timestamp;
}

export interface RideRequest {
  id?: string;
  travelerId: string;
  travelerName: string;
  origin: string;
  destination: string;
  passengers: number;
  status: RideStatus;
  rideType?: 'standard' | 'robotaxi';
  providerId?: string;
  vehicleId?: string;
  vehicleDetails?: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  fare?: number;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  driverLat?: number;
  driverLng?: number;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'provider' | 'admin';
  walletBalance?: number;
  createdAt: Timestamp;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
