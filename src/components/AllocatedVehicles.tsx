import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Car, Bike } from "lucide-react";
import { Allocation, Driver, Vehicle } from "@/types";
import VehicleInfoModal from "./VehicleInfoModal";

const getVehicleAndDriver = (
  drivers: Driver[],
  vehicles: Vehicle[],
  allocation: Allocation
): { vehicle: Vehicle | null; driver: Driver | null } => {
  const vehicle = vehicles.find((v) => v.id === allocation.vehicle) || null;
  const driver = drivers.find((d) => d.id === allocation.driver) || null;
  return { vehicle, driver };
};

type AllocatedVehiclesProps = {
  drivers: Driver[];
  allocations: Allocation[];
  vehicles: Vehicle[];
};

export function AllocatedVehicles({
  drivers,
  allocations,
  vehicles,
}: AllocatedVehiclesProps) {
  // Sort allocations by startDate in descending order and take the first 10
  const recentAllocations = allocations
    .filter((a) => a.status === "Active" || a.status === "Completed")
    .sort((a, b) => b.startDate.toMillis() - a.startDate.toMillis())
    .slice(0, 10);

  return (
    <Card>
      <CardHeader className="py-4 px-2">
        <CardTitle className="text-base text-center">
          Allocations récentes en cours et completées
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ScrollArea className="h-[60vh]">
          {recentAllocations.map((allocation) => {
            const { vehicle, driver } = getVehicleAndDriver(
              drivers,
              vehicles,
              allocation
            );
            if (!vehicle || !driver) return null;

            return (
              <div key={allocation.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    {vehicle.type === "car" ? (
                      <Car className="h-4 w-4" />
                    ) : (
                      <Bike className="h-4 w-4" />
                    )}
                    <span className="font-bold text-sm">{vehicle.plate}</span>
                  </div>
                  <Badge
                    variant={
                      allocation.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {allocation.status === "Active" ? "Active" : "Completé"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{driver.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {driver.phone}
                    </span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <VehicleInfoModal vehicle={vehicle} driver={driver} />
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
