"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Car, Bike } from "lucide-react";
import { vehicles, drivers, allocations, revenueData } from "@/utils/data";
import { Driver } from "@/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "leaflet/dist/leaflet.css";
import VehicleInfoModal from "@/components/VehicleInfoModal";

const carIcon = new Icon({
  iconUrl: "/car-icon.png",
  iconSize: [24, 40],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const bikeIcon = new Icon({
  iconUrl: "/bike-icon.png",
  iconSize: [24, 24],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function DashboardPage() {
  const getDriverForVehicle = (vehiclePlate: string): Driver | undefined => {
    const allocation = allocations.find(
      (a) => a.vehicle === vehiclePlate && a.status === "En cours"
    );
    return allocation
      ? drivers.find((d) => d.id === allocation.driver)
      : undefined;
  };

  return (
    <div className="h-full space-y-4 w-full">
      <h1 className="text-3xl font-bold">Tableau de Bord IBI Fleet - Bamako</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
        <Card className="lg:col-span-3">
          <CardContent
            className="p-0"
            style={{ height: "100%", width: "100%" }}
          >
            <MapContainer
              center={[12.6392, -8.0029]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {vehicles.map((vehicle) => {
                const driver = getDriverForVehicle(vehicle.plate);

                return (
                  <Marker
                    key={vehicle.id}
                    position={vehicle.position}
                    icon={vehicle.type === "car" ? carIcon : bikeIcon}
                  >
                    <Popup className="z-[9998]">
                      <div className="text-center space-y-0">
                        <h3 className="font-bold">{vehicle.plate}</h3>
                        <p>{vehicle.type === "car" ? "Voiture" : "Moto"}</p>
                        <p>Statut: {vehicle.status}</p>
                        <p className="flex flex-col justify-center items-center">
                          <span>Chauffeur: {driver?.name}</span>
                          <span>Tel: {driver?.phone}</span>
                        </p>
                        <VehicleInfoModal vehicle={vehicle} driver={driver} />
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Véhicules et Conducteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh]">
              {vehicles.map((vehicle) => {
                const driver = getDriverForVehicle(vehicle.plate);
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
                          {new Date(allocation.startDate).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          {new Date(allocation.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              allocation.status === "En cours"
                                ? "default"
                                : allocation.status === "Terminée"
                                ? "secondary"
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

        <Card>
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
        </Card>
      </div>
    </div>
  );
}
