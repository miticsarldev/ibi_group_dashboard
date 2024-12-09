"use client";

import React from "react";
import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Vehicle } from "@/types";
import VehicleInfoModal from "./VehicleInfoModal";
import { getDriverForVehicle } from "@/utils/functions";

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

const Map = ({ vehicles }: { vehicles: Vehicle[] }) => {
  return (
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
        const driver = getDriverForVehicle(vehicle.id);

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
  );
};

export default Map;
