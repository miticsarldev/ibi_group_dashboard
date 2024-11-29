/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { vehicles } from "@/utils/data";
import { VehicleForm } from "@/components/VehicleForm";
import { Vehicle } from "@/types";

type SortColumn = "Vnumber" | "plate" | "type" | "status";
type SortDirection = "asc" | "desc";

export default function VehiclesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [sort, setSort] = useState<{
    column: SortColumn;
    direction: SortDirection;
  }>({ column: "plate", direction: "asc" });

  // Filter vehicles based on search term
  const filteredVehicles = vehicles
    .filter(
      (vehicle) =>
        vehicle.Vnumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sort.column) {
        if (a[sort!.column] < b[sort!.column])
          return sort.direction === "asc" ? -1 : 1;
        if (a[sort!.column] > b[sort!.column])
          return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Paginate vehicles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality here
    console.log(`Delete vehicle with id: ${id}`);
  };

  const handleSort = (column: SortColumn) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-5">Gestion des Véhicules</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          className="max-w-sm"
          placeholder="Rechercher un véhicule..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
              <DialogDescription>
                Entrez les détails du nouveau véhicule ici. Cliquez sur
                sauvegarder une fois terminé.
              </DialogDescription>
            </DialogHeader>
            <VehicleForm />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Image du véhicule</TableHead>
            <TableHead className="text-center">
              <Button
                variant="ghost"
                onClick={() => handleSort("Vnumber")}
                className="w-full justify-center"
              >
                Numéro de véhicule <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">
              <Button
                variant="ghost"
                onClick={() => handleSort("plate")}
                className="w-full justify-center"
              >
                Plaque <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">
              <Button
                variant="ghost"
                onClick={() => handleSort("type")}
                className="w-full justify-center"
              >
                Type <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="w-full justify-center"
              >
                Statut <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="flex items-center justify-center">
                <img
                  src={
                    vehicle.type === "bike" ? "/bike-icon.png" : "/car-icon.png"
                  }
                  className={
                    vehicle.type === "bike"
                      ? "h-6 w-6 -rotate-45"
                      : "h-12 w-8 rotate-90"
                  }
                  alt={vehicle.type}
                />
              </TableCell>
              <TableCell className="text-center">{vehicle.Vnumber}</TableCell>
              <TableCell className="text-center">{vehicle.plate}</TableCell>
              <TableCell className="text-center">
                {vehicle.type === "bike" ? "Moto" : "Voiture"}
              </TableCell>
              <TableCell className="text-center">{vehicle.status}</TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modifier le véhicule</DialogTitle>
                      <DialogDescription>
                        Modifiez les détails du véhicule ici. Cliquez sur
                        sauvegarder une fois terminé.
                      </DialogDescription>
                    </DialogHeader>
                    <VehicleForm vehicle={editingVehicle!} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(vehicle.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Véhicules par page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value: string) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="mx-2">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
