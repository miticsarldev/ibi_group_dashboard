"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ChargingStation } from "@/types";
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
import { ChargingStationForm } from "./charging-station-form";

export default function ChargingStationsPage() {
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<ChargingStation | null>(
    null
  );

  useEffect(() => {
    fetchChargingStations();
  }, []);

  const fetchChargingStations = async () => {
    setIsLoading(true);
    try {
      const fetchedStations = await listDocuments<ChargingStation>(
        "chargingStations"
      );
      setChargingStations(fetchedStations);
    } catch (error) {
      console.error("Error fetching charging stations:", error);
    }
    setIsLoading(false);
  };

  const handleCreateStation = async (
    stationData: Omit<ChargingStation, "id">
  ) => {
    try {
      await createDocument("chargingStations", {
        ...stationData,
        id: undefined,
      });
      fetchChargingStations();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating charging station:", error);
    }
  };

  const handleUpdateStation = async (
    stationData: Omit<ChargingStation, "id">
  ) => {
    try {
      if (editingStation) {
        await updateDocument("chargingStations", {
          ...stationData,
          id: editingStation.id,
        });
        fetchChargingStations();
        setIsFormOpen(false);
        setEditingStation(null);
      }
    } catch (error) {
      console.error("Error updating charging station:", error);
    }
  };

  const handleDeleteStation = async (id: string) => {
    try {
      await deleteDocument("chargingStations", id);
      fetchChargingStations();
    } catch (error) {
      console.error("Error deleting charging station:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Stations de Recharge</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Station
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={chargingStations}
          onDelete={handleDeleteStation}
          onEdit={(station) => {
            setEditingStation(station);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <ChargingStationForm
          station={editingStation!}
          onSubmit={editingStation ? handleUpdateStation : handleCreateStation}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStation(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
