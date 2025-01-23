"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Driver, Passenger, Ride } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { RideForm } from "./ride-form";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { Loader } from "@/components/ui/loader";

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const fetchedRides = await listDocuments<Ride>("rides");
      const fetchedDrivers = await listDocuments<Driver>("drivers");
      const fetchedPassengers = await listDocuments<Passenger>("passengers");
      setDrivers(fetchedDrivers);
      setPassengers(fetchedPassengers);
      setRides(fetchedRides);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
    setIsLoading(false);
  };

  const handleCreateRide = async (rideData: Omit<Ride, "id">) => {
    try {
      await createDocument("rides", { ...rideData, id: undefined });
      fetchRides();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  };

  const handleUpdateRide = async (rideData: Omit<Ride, "id">) => {
    try {
      if (editingRide) {
        await updateDocument("rides", { ...rideData, id: editingRide.id });
        fetchRides();
        setIsFormOpen(false);
        setEditingRide(null);
      }
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  };

  const handleDeleteRide = async (id: string) => {
    try {
      await deleteDocument("rides", id);
      fetchRides();
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Courses</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Course
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rides}
          onEdit={() => {
            setEditingRide(null);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteRide}
        />
      )}
      {isFormOpen && (
        <RideForm
          ride={editingRide!}
          onSubmit={editingRide ? handleUpdateRide : handleCreateRide}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRide(null);
          }}
          isOpen={isFormOpen}
          drivers={drivers || []}
          passengers={passengers || []}
        />
      )}
    </div>
  );
}
