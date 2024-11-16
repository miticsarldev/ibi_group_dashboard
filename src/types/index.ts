export type VehicleStatus = "En service" | "En maintenance" | "Disponible";
export type VehicleType = "car" | "bike";

export type Vehicle = {
  id: number;
  type: VehicleType;
  plate: string;
  Vnumber?: string;
  status: VehicleStatus;
  position: [number, number];
};

export type DriverStatus = "Active" | "Inactive" | "Suspension";

export type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  isActive: boolean;
  licenseNumber: string;
  status: DriverStatus;
  experienceYears: number;
  rating?: number;
  joinedDate: string;
};

export type AllocationStatus = "En cours" | "Terminée" | "Planifiée";

export type AllocationType = "Mission" | "Transport";

export type Allocation = {
  id: number;
  driver: number;
  vehicle: string;
  startDate: string;
  endDate: string;
  type: AllocationType;
  status: AllocationStatus;
  notes?: string;
};

export type Route = {
  id: number;
  name: string;
  description: string;
  start: [number, number];
  end: [number, number];
  drivers: Driver[];
  vehicles: Vehicle[];
  allocations: Allocation[];
};