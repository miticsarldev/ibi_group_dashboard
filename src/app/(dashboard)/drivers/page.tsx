"use client";

import { useState, useEffect } from "react";
import { Driver, TaxiDriver } from "@/types";
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
import { TaxiDriverForm } from "./driver-form";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<TaxiDriver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<TaxiDriver | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const fetchedDrivers = await listDocuments<TaxiDriver>("taxi_drivers");
      console.log(fetchedDrivers);

      setDrivers(fetchedDrivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
    setIsLoading(false);
  };

  const handleCreateDriver = async (driverData: Omit<Driver, "id">) => {
    try {
      const createdDriverData = { ...driverData, id: undefined };
      await createDocument("drivers", createdDriverData);
      fetchDrivers();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating driver:", error);
    }
  };

  const handleUpdateDriver = async (driverData: Omit<TaxiDriver, "id">) => {
    try {
      if (!editingDriver!.id) {
        throw new Error("Editing driver ID is missing");
      }
      const updatedDriverData = { id: editingDriver!.id, ...driverData };
      await updateDocument("drivers", updatedDriverData);
      fetchDrivers();
      setIsFormOpen(false);
      setEditingDriver(null);
    } catch (error) {
      console.error("Error updating driver:", error);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    try {
      await deleteDocument("drivers", id);
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleSubmit = (driverData: Omit<TaxiDriver, "id">) => {
    if (editingDriver) {
      return handleUpdateDriver(driverData);
    } else {
      return handleCreateDriver(driverData as unknown as Omit<Driver, "id">);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">
          Gestion des Allocateurs et Chauffeurs
        </h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Allocateur
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={drivers}
          onDelete={handleDeleteDriver}
          onEdit={(driver) => {
            setEditingDriver(driver);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <TaxiDriverForm
          driver={editingDriver!}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingDriver(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
