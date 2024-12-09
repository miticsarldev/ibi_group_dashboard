import { Driver } from "@/types";
import { allocations, drivers } from "./data";

export const getDriverForVehicle = (vehicle: number): Driver | undefined => {
  const allocation = allocations.find(
    (a) => a.vehicle === vehicle && a.status === "En cours"
  );
  return allocation
    ? drivers.find((d) => d.id === allocation.driver)
    : undefined;
};
