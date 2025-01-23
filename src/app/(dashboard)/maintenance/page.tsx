"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { MaintenanceRecord, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { getMaintenanceColumns } from "./columns";
import { MaintenanceForm } from "./maintenance-form";

export default function MaintenancesPage() {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] =
    useState<MaintenanceRecord | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedMaintenances, fetchedVehicles] = await Promise.all([
        listDocuments<MaintenanceRecord>("maintenances"),
        listDocuments<Vehicle>("vehicles"),
      ]);
      setMaintenances(fetchedMaintenances);
      setVehicles(fetchedVehicles);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateMaintenance = async (
    maintenanceData: Omit<MaintenanceRecord, "id">
  ) => {
    try {
      await createDocument("maintenances", {
        ...maintenanceData,
        id: undefined,
      });
      fetchData();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating maintenance record:", error);
    }
  };

  const handleUpdateMaintenance = async (
    maintenanceData: Omit<MaintenanceRecord, "id">
  ) => {
    try {
      if (editingMaintenance) {
        await updateDocument("maintenances", {
          ...maintenanceData,
          id: editingMaintenance.id,
        });
        fetchData();
        setIsFormOpen(false);
        setEditingMaintenance(null);
      }
    } catch (error) {
      console.error("Error updating maintenance record:", error);
    }
  };

  const handleDeleteMaintenance = async (id: string) => {
    try {
      await deleteDocument("maintenances", id);
      fetchData();
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
    }
  };

  const columns = getMaintenanceColumns(vehicles);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Maintenances</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Maintenance
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={maintenances}
          onDelete={handleDeleteMaintenance}
          onEdit={() => {
            setEditingMaintenance(null);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <MaintenanceForm
          maintenance={editingMaintenance!}
          onSubmit={
            editingMaintenance
              ? handleUpdateMaintenance
              : handleCreateMaintenance
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMaintenance(null);
          }}
          isOpen={isFormOpen}
          vehicles={vehicles}
          maintenances={maintenances}
        />
      )}
    </div>
  );
}
