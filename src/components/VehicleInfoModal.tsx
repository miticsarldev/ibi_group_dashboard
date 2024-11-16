"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Driver, Vehicle } from "@/types";
import { Info } from "lucide-react";

const VehicleInfoModal = ({
  vehicle,
  driver,
}: {
  vehicle: Vehicle;
  driver?: Driver;
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <Info className="h-2 w-2" />
      </Button>
    </DialogTrigger>
    <DialogOverlay className="z-[9998]" />
    <DialogContent className="z-[9999]">
      <DialogHeader>
        <DialogTitle>Informations sur le Véhicule et le Conducteur</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div>
          <h3 className="font-bold">Véhicule</h3>
          <p>Plaque: {vehicle.plate}</p>
          <p>Type: {vehicle.type === "car" ? "Voiture" : "Moto"}</p>
          <p>Statut: {vehicle.status}</p>
          {vehicle.Vnumber && <p>Numéro: {vehicle.Vnumber}</p>}
        </div>
        {driver && (
          <div>
            <h3 className="font-bold">Conducteur</h3>
            <p>Nom: {driver.name}</p>
            <p>License: {driver.licenseNumber}</p>
            <p>Expérience: {driver.experienceYears} ans</p>
            <p>Statut: {driver.status}</p>
            <p>Note: {driver.rating ? `${driver.rating}/5` : "N/A"}</p>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default VehicleInfoModal;
