"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getAllocationColumns } from "./columns";
import { Allocation, Driver, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AllocationForm } from "./allocation-form";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { Loader } from "@/components/ui/loader";

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedAllocations, fetchedDrivers, fetchedVehicles] =
        await Promise.all([
          listDocuments<Allocation>("allocations"),
          listDocuments<Driver>("drivers"),
          listDocuments<Vehicle>("vehicles"),
        ]);
      setAllocations(fetchedAllocations);
      setDrivers(fetchedDrivers);
      setVehicles(fetchedVehicles);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateAllocation = async (
    allocationData: Omit<Allocation, "id">
  ) => {
    try {
      const createdAllocation = {
        ...allocationData,
        id: undefined,
      };
      await createDocument("allocations", createdAllocation);
      fetchData();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating allocation:", error);
    }
  };

  const handleUpdateAllocation = async (
    allocationData: Omit<Allocation, "id">
  ) => {
    try {
      if (editingAllocation) {
        await updateDocument("allocations", {
          ...allocationData,
          id: editingAllocation.id,
        });
        fetchData();
        setIsFormOpen(false);
        setEditingAllocation(null);
      }
    } catch (error) {
      console.error("Error updating allocation:", error);
    }
  };

  const handleDeleteAllocation = async (id: string) => {
    try {
      await deleteDocument("allocations", id);
      fetchData();
    } catch (error) {
      console.error("Error deleting allocation:", error);
    }
  };

  const columns = getAllocationColumns(drivers, vehicles);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Allocations</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Allocation
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={allocations}
          onDelete={handleDeleteAllocation}
          onEdit={(allocation) => {
            setEditingAllocation(allocation);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <AllocationForm
          allocation={editingAllocation!}
          onSubmit={
            editingAllocation ? handleUpdateAllocation : handleCreateAllocation
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAllocation(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
