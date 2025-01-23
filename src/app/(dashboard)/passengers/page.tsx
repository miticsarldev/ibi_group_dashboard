"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Passenger } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { Loader } from "@/components/ui/loader";
import { columns } from "./columns";
import { PassengerForm } from "./passenger-form";

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(
    null
  );

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    setIsLoading(true);
    try {
      const fetchedPassengers = await listDocuments<Passenger>("passengers");
      setPassengers(fetchedPassengers);
    } catch (error) {
      console.error("Error fetching passengers:", error);
    }
    setIsLoading(false);
  };

  const handleCreatePassenger = async (
    passengerData: Omit<Passenger, "id">
  ) => {
    try {
      await createDocument("passengers", { ...passengerData, id: undefined });
      fetchPassengers();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating passenger:", error);
    }
  };

  const handleUpdatePassenger = async (
    passengerData: Omit<Passenger, "id">
  ) => {
    try {
      if (editingPassenger) {
        await updateDocument("passengers", {
          ...passengerData,
          id: editingPassenger.id,
        });
        fetchPassengers();
        setIsFormOpen(false);
        setEditingPassenger(null);
      }
    } catch (error) {
      console.error("Error updating passenger:", error);
    }
  };

  const handleDeletePassenger = async (id: string) => {
    try {
      await deleteDocument("passengers", id);
      fetchPassengers();
    } catch (error) {
      console.error("Error deleting passenger:", error);
    }
  };

  const openCreateForm = () => {
    setEditingPassenger(null);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Passagers</h1>
        <Button onClick={openCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Passager
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={passengers}
          onDelete={handleDeletePassenger}
          onEdit={() => {
            setIsFormOpen(true);
            setEditingPassenger(null);
          }}
        />
      )}
      {isFormOpen && (
        <PassengerForm
          passenger={editingPassenger!}
          onSubmit={
            editingPassenger ? handleUpdatePassenger : handleCreatePassenger
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingPassenger(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
