export type VehicleStatus = "En service" | "En maintenance" | "Disponible";
export type VehicleType = "car" | "bike";

export type Vehicle = {
  id: number;
  type: VehicleType;
  plate: string;
  Vnumber: string;
  status: VehicleStatus;
  position: [number, number];
  batteryLevel?: number;
  estimatedRange?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
};

export type DriverStatus = "Active" | "Inactive" | "Suspension";

export type Driver = {
  id: number;
  name: string;
  image?: string;
  email: string;
  phone: string;
  address?: string;
  isActive: boolean;
  licenseNumber: string;
  status: DriverStatus;
  experienceYears: number;
  rating: number;
  joinedDate: string;
};

export type AllocationStatus =
  | "Active"
  | "Completed"
  | "Scheduled"
  | "Cancelled";

export type AllocationType = "Mission" | "Transport";

export type Allocation = {
  id: number;
  driver: number;
  vehicle: number;
  isPaid: boolean;
  startDate: string;
  endDate: string;
  type: AllocationType;
  status: AllocationStatus;
  notes?: string;
};

export type MaintenanceRecord = {
  id: number;
  vehicle: number;
  date: string;
  description: string;
  cost: number;
  type: "Routine" | "Repair" | "Inspection";
};

export type ChargingStation = {
  id: number;
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
  language: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
};
