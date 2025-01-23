"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import {
  Vehicle,
  Driver,
  Allocation,
  ChargingStation,
  MaintenanceRecord,
  AllocationStatus,
} from "@/types";
import { listDocuments } from "@/firebase/firebase.services";
import {
  BarChartComponent,
  LineChartComponent,
  PieChartComponent,
} from "@/components/charts";
import { AllocatedVehicles } from "@/components/AllocatedVehicles";
import { Bike, Car } from "lucide-react";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>(
    []
  );
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedVehicles = await listDocuments<Vehicle>("vehicles");
      const fetchedDrivers = await listDocuments<Driver>("drivers");
      const fetchedAllocations = await listDocuments<Allocation>("allocations");
      const fetchedChargingStations = await listDocuments<ChargingStation>(
        "chargingStations"
      );
      const fetchedMaintenances = await listDocuments<MaintenanceRecord>(
        "maintenances"
      );

      setVehicles(fetchedVehicles);
      setDrivers(fetchedDrivers);
      setAllocations(fetchedAllocations);
      setChargingStations(fetchedChargingStations);
      setMaintenances(fetchedMaintenances);
    };

    fetchData();
  }, []);

  const recentAllocations = allocations
    .sort((a, b) => b.startDate.toMillis() - a.startDate.toMillis())
    .slice(0, 10);
  const recentMaintenances = maintenances
    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
    .slice(0, 5);

  const vehicleStatusData = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusTranslations: Record<AllocationStatus, string> = {
    Active: "Actif",
    Completed: "Terminé",
    Scheduled: "Planifié",
    Cancelled: "Annulé",
  };

  const allocationStatusData = allocations.reduce((acc, allocation) => {
    const translatedStatus = statusTranslations[allocation.status];
    acc[translatedStatus] = (acc[translatedStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maintenanceCostData = maintenances.reduce((acc, maintenance) => {
    const month = format(maintenance.date.toDate(), "MMM");
    acc[month] = (acc[month] || 0) + maintenance.cost;
    return acc;
  }, {} as Record<string, number>);

  const monthlyRevenueData = allocations.reduce((acc, allocation) => {
    const month = format(allocation.startDate.toDate(), "MMM");
    acc[month] = (acc[month] || 0) + (allocation.isPaid ? 1 : 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full space-y-4 w-full mb-4">
      <h1 className="text-3xl font-bold">Tableau de Bord IBI Fleet - Bamako</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
        <Card className="lg:col-span-3">
          <CardContent
            className="p-0"
            style={{ height: "100%", width: "100%" }}
          >
            <Map
              vehicles={vehicles}
              chargingStations={chargingStations}
              drivers={drivers}
              allocations={allocations}
            />
          </CardContent>
        </Card>

        <AllocatedVehicles
          drivers={drivers}
          vehicles={vehicles}
          allocations={allocations}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Allocations Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-center p-2">Conducteur</th>
                    <th className="text-center p-2">Véhicule</th>
                    <th className="text-center p-2">Date de début</th>
                    <th className="text-center p-2">Date de fin</th>
                    <th className="text-center p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAllocations.map((allocation) => {
                    const driver = drivers.find(
                      (d) => d.id === allocation.driver
                    );
                    const vehicle = vehicles.find(
                      (v) => v.id === allocation.vehicle
                    );
                    return (
                      <tr key={allocation.id} className="border-t">
                        <td className="p-2 flex flex-col justify-center items-center">
                          <span>{driver?.name}</span>
                          <span className="text-xs">{driver?.phone}</span>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <div className="text-xs">
                              {vehicle?.type === "bike" ? (
                                <Bike size={16} />
                              ) : (
                                <Car size={16} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <div className="text-xs">{vehicle?.plate}</div>
                              <div className="text-sm">{vehicle?.Vnumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {format(
                            allocation.startDate.toDate(),
                            "dd/MM/yyyy 'à' HH:mm"
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {format(
                            allocation.endDate.toDate(),
                            "dd/MM/yyyy 'à' HH:mm"
                          )}
                        </td>
                        <td className="p-2  text-center">
                          <Badge
                            variant={
                              allocation.status === "Active"
                                ? "default"
                                : allocation.status === "Completed"
                                ? "secondary"
                                : allocation.status === "Cancelled"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {allocation.status === "Active" && "En cours"}
                            {allocation.status === "Cancelled" && "Annulé"}
                            {allocation.status === "Completed" && "Terminé"}
                            {allocation.status === "Scheduled" && "Planifié"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Maintenances Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-center p-2">Véhicule</th>
                    <th className="text-center p-2">Date</th>
                    <th className="text-center p-2">Type</th>
                    <th className="text-center p-2">Coût</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMaintenances.map((maintenance) => {
                    const vehicle = vehicles.find(
                      (v) => v.id === maintenance.vehicle
                    );
                    return (
                      <tr key={maintenance.id} className="border-t">
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <div className="text-xs">
                              {vehicle?.type === "bike" ? (
                                <Bike size={16} />
                              ) : (
                                <Car size={16} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <div className="text-xs">{vehicle?.plate}</div>
                              <div className="text-sm">{vehicle?.Vnumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {format(maintenance.date.toDate(), "dd/MM/yyyy")}
                        </td>
                        <td className="p-2 text-center">
                          {maintenance.type === "Inspection" && "Inspection"}
                          {maintenance.type === "Repair" && "Reparation"}
                          {maintenance.type === "Routine" && "Routine"}
                        </td>
                        <td className="p-2 text-center">
                          {maintenance.cost} FCFA
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Statut des Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={vehicleStatusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Statut des Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={allocationStatusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Coûts de Maintenance Mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={maintenanceCostData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Revenus Mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChartComponent data={monthlyRevenueData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
