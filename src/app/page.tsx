"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

import { Car, Bike } from "lucide-react";
import { vehicles, drivers, allocations, chargingStations } from "@/utils/data";
// import {
//   Bar,
//   BarChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";
import VehicleInfoModal from "@/components/VehicleInfoModal";
import dynamic from "next/dynamic";
import { getDriverForVehicle } from "@/utils/functions";
const Map = dynamic(() => import("../components/map"), { ssr: false });
import "leaflet/dist/leaflet.css";

export default function DashboardPage() {
  return (
    <div className="h-full space-y-4 w-full">
      <h1 className="text-3xl font-bold">Tableau de Bord IBI Fleet - Bamako</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
        <Card className="lg:col-span-3">
          <CardContent
            className="p-0"
            style={{ height: "100%", width: "100%" }}
          >
            <Map
              vehicles={vehicles}
              chargingStations={chargingStations ?? []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Véhicules et Conducteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh]">
              {vehicles.map((vehicle) => {
                const driver = getDriverForVehicle(vehicle.id);
                return (
                  <div key={vehicle.id} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        {vehicle.type === "car" ? (
                          <Car className="h-4 w-4" />
                        ) : (
                          <Bike className="h-4 w-4" />
                        )}
                        <span className="font-bold text-sm">
                          {vehicle.plate}
                        </span>
                      </div>
                      <Badge
                        variant={
                          vehicle.status === "En service"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    {driver && (
                      <div className="flex justify-between">
                        <div className="flex flex-col items-start space-x-1 mt-1">
                          <span className="text-sm font-semibold">
                            {driver.name}
                          </span>
                          <span className="text-sm">{driver.phone}</span>
                        </div>
                        <div className="flex justify-end mt-2">
                          <VehicleInfoModal vehicle={vehicle} driver={driver} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Allocations Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[30vh]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Conducteur</th>
                    <th className="text-left p-2">Véhicule</th>
                    <th className="text-left p-2">Date de début</th>
                    <th className="text-left p-2">Date de fin</th>
                    <th className="text-left p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => {
                    const driver = drivers.find(
                      (d) => d.id === allocation.driver
                    );
                    return (
                      <tr key={allocation.id} className="border-t">
                        <td className="p-2">
                          {driver?.name}:{" "}
                          <span className="text-xs">{driver?.phone}</span>
                        </td>
                        <td className="p-2">{allocation.vehicle}</td>
                        <td className="p-2">
                          {format(
                            new Date(allocation.startDate),
                            "dd/MM/yyyy 'à' HH:mm"
                          )}
                        </td>
                        <td className="p-2">
                          {format(
                            new Date(allocation.endDate),
                            "dd/MM/yyyy 'à' HH:mm"
                          )}
                        </td>
                        <td className="p-2">
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
                            {allocation.status}
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

        {/* <Card>
          <CardHeader>
            <CardTitle>Revenus Mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
