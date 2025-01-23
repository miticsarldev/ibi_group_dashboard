"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Loader } from "@/components/ui/loader";
import { VehicleForm } from "./vehicle-form";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const fetchedVehicles = await listDocuments<Vehicle>("vehicles");
      setVehicles(fetchedVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
    setIsLoading(false);
  };

  const handleCreateVehicle = async (vehicleData: Omit<Vehicle, "id">) => {
    try {
      const createdVehicleData = { ...vehicleData, id: undefined };
      await createDocument("vehicles", createdVehicleData);
      fetchVehicles();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  const handleUpdateVehicle = async (vehicleData: Omit<Vehicle, "id">) => {
    try {
      const updatedVehicleData = { id: editingVehicle!.id, ...vehicleData };
      await updateDocument("vehicles", updatedVehicleData);
      fetchVehicles();
      setIsFormOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteDocument("vehicles", id);
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Véhicules</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Véhicule
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={vehicles}
          onDelete={handleDeleteVehicle}
          onEdit={(vehicle) => {
            setEditingVehicle(vehicle);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <VehicleForm
          vehicle={editingVehicle!}
          onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
