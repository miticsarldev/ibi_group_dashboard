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

export type TaxiUserType = "client" | "driver";

export type TaxiUserGender = "male" | "female";

export type TaxiDriverStatus = "Active" | "Inactive" | "Suspension";

export interface TaxiUser {
  id?: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  password?: string;
  image?: string;
  userType?: TaxiUserType;
  gender?: TaxiUserGender | "";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type Coordinates = {
  latitude: number;
  longitude: number;
  address: string;
};

export type PaymentMethod = {
  type: "card" | "cash" | "mobile_money";
  details: {
    // Common details
    provider?: string; // e.g., Visa, MasterCard, MTN Mobile Money
    lastFourDigits?: string; // For card and mobile money

    // Card-specific details
    cardHolderName?: string;
    cardNumber?: string; // Encrypted or tokenized card number
    expiryDate?: string; // e.g., MM/YY
    cvv?: string; // Encrypted CVV for card validation

    // Mobile money-specific details
    phoneNumber?: string; // Linked mobile number

    // Cash-specific details
    notes: string; // Optional notes, e.g., "Exact cash preferred"
  };
  addedAt: Timestamp; // When the payment method was added
  isDefault?: boolean; // Whether this is the default payment method
};

export type TaxiDriver = TaxiUser & {
  userType: "driver";
  address?: string;
  isActive?: boolean;
  onDuty?: boolean;
  licenseNumber: string;
  status: TaxiDriverStatus;
  experienceYears: string;
  rating?: number;
  joinedDate?: Timestamp;
  isAllocator?: boolean;
  isApprouved?: boolean;
  vehicleType: VehicleType | "";
  vehicleOptions: VehicleOptions | "";
  vehicleColor: string;
  vehicleNumber: string;
  vehiclePassengers?: number;
  currentLocation?: Coordinates & {
    heading: number;
  };
  availableForRides?: boolean;
  totalRides?: number;
  totalEarnings?: number;
};

export type TaxiClient = TaxiUser & {
  userType: "client";
  currentLocation?: Coordinates;
  favoriteLocations?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }[];
  paymentMethods?: PaymentMethod[];
  totalRides?: number;
  rating?: number;
};

export type RideStatus =
  | "requested"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Ride = {
  id: string;
  client: string;
  driver: string;
  status: RideStatus;
  startLocation: Coordinates;
  destinationLocation: Coordinates;
  vehicleType: VehicleType | "";
  vehicleOptions: VehicleOptions | "";
  vehicleColor: string;
  vehicleNumber: string;
  vehiclePassengers?: number;
  paymentMethod: PaymentMethod;
  fare: number;
  distance: number;
  duration: number;
  startTime?: Timestamp;
  endTime?: Timestamp;
  rating?: number;
  feedback?: string;
};
