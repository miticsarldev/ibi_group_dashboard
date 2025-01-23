import { Timestamp } from "firebase/firestore";

export type VehicleStatus =
  | "En service"
  | "En maintenance"
  | "Disponible"
  | "Inactive";
export type VehicleOptions = "IBI Electric" | "Economique" | "Premium";
export type VehicleType = "car" | "bike";

export type Vehicle = {
  id: string;
  type: VehicleType;
  plate: string;
  Vnumber: string;
  status: VehicleStatus;
  position: [number, number];
  batteryLevel?: number;
  estimatedRange?: number;
  lastMaintenanceDate?: Timestamp;
  nextMaintenanceDate?: Timestamp;
  vOptions?: VehicleOptions;
  isElectric?: boolean;
};

export type DriverStatus = "Active" | "Inactive" | "Suspension";

export type Driver = {
  id: string;
  name: string;
  image?: string;
  email: string;
  phone: string;
  address?: string;
  isActive: boolean;
  licenseNumber: string;
  status: DriverStatus;
  experienceYears: number;
  rating?: number;
  joinedDate: Timestamp;
  isAllocator: boolean;
};

export type AllocationStatus =
  | "Active"
  | "Completed"
  | "Scheduled"
  | "Cancelled";

export type AllocationType = "Mission" | "Transport";

export type Allocation = {
  id: string;
  driver: string;
  vehicle: string;
  isPaid: boolean;
  startDate: Timestamp;
  endDate: Timestamp;
  type: AllocationType;
  status: AllocationStatus;
  notes?: string;
};

export type MaintenanceRecord = {
  id: string;
  vehicle: string;
  date: Timestamp;
  description: string;
  cost: number;
  type: "Routine" | "Repair" | "Inspection";
};

export type ChargingStation = {
  id: string;
  name: string;
  location: [number, number];
  availablePlugs: number;
  totalPlugs: number;
  pricePerCharge: number;
  operatingHours?: string;
};

export type GlobalParameters = {
  carAmount: string;
  motorbikeAmount: string;
  chargingStationRate: string;
  maintenanceThreshold: string;
  defaultCurrency: string;
  estimatedRangeCar: string;
  estimatedRangeMotorbike: string;
  language: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
};

export type RideStatus = "Pending" | "Ongoing" | "Completed" | "Cancelled";

export type Ride = {
  id: string;
  passenger: string;
  driver: string;
  vehicle: string;
  startLocation: [number, number];
  endLocation: [number, number];
  fare: number;
  distance: number;
  startTime: Timestamp;
  endTime?: Timestamp;
  status: RideStatus;
  paymentMethod: "Card" | "Cash" | "Wallet";
  rating?: number;
};

export type Passenger = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  profilePicture?: string;
  walletBalance: number;
  joinedDate: Timestamp;
  rideHistory: string[];
};

export type PricingParameters = {
  id: string;
  baseFare: number;
  perKilometerRate: number;
  perMinuteRate: number;
  surgeMultiplier?: number;
  cancellationFee: number;
};

// Keeping the existing types for compatibility
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "dispatcher" | "driver" | "taxi_driver";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  lastLogin?: Timestamp;
}

export interface Admin extends User {
  role: "admin";
}

export interface Dispatcher extends User {
  role: "dispatcher";
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;

  pricePerKm: number;
  pricePerMinute: number;
  vehicleType: "car" | "bike" | "both";
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expirationDate: Timestamp;
  maxUses: number;
  currentUses: number;
}

export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export type Document = {
  id: string;
  driverId: string;
  vehicleId?: string;
  typeId: string;
  fileUrl: string;
  expirationDate: Timestamp | null;
  isVerified: boolean;
  uploadDate: Timestamp;
  notes: string;
};
