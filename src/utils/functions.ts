import { Driver, Vehicle, Allocation } from "@/types";

export const getDriverAndVehicle = (
  drivers: Driver[],
  vehicles: Vehicle[],
  allocations: Allocation[],
  vehicleId: string
): {
  driver: Driver | null;
  vehicle: Vehicle | null;
  //   allocation: Allocation | null;
} => {
  const vehicle = vehicles.find((v) => v.id === vehicleId) || null;
  const allocation =
    allocations.find((a) => a.vehicle === vehicleId && a.status === "Active") ||
    null;
  const driver = allocation
    ? drivers.find((d) => d.id === allocation.driver) || null
    : null;
  return { driver, vehicle };
};
