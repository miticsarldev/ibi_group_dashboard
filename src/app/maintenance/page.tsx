"use client";

import { useState } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
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

import { MaintenanceRecord } from "@/types";
import { MaintenanceForm } from "@/components/MaintenanceForm";
import { Badge } from "@/components/ui/badge";
import { maintenanceRecords, vehicles } from "@/utils/data";

type SortColumn = "vehicle" | "date" | "type" | "cost";
type SortDirection = "asc" | "desc";

export default function MaintenanceDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingMaintenance, setEditingMaintenance] =
    useState<MaintenanceRecord | null>(null);
  const [sort, setSort] = useState<{
    column: SortColumn;
    direction: SortDirection;
  }>({ column: "date", direction: "desc" });

  // Filter maintenance records based on search term
  const filteredMaintenanceRecords = maintenanceRecords
    .filter(
      (record) =>
        vehicles
          .find((v) => v.id === record.vehicle)
          ?.plate.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        vehicles
          .find((v) => v.id === record.vehicle)
          ?.Vnumber.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sort.column) {
        let valueA, valueB;
        if (sort.column === "vehicle") {
          valueA = vehicles.find((v) => v.id === a.vehicle)?.plate || "";
          valueB = vehicles.find((v) => v.id === b.vehicle)?.plate || "";
        } else {
          valueA = a[sort.column];
          valueB = b[sort.column];
        }
        if (valueA < valueB) return sort.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Paginate maintenance records
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaintenanceRecords = filteredMaintenanceRecords.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    filteredMaintenanceRecords.length / itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality here
    console.log(`Delete maintenance record with id: ${id}`);
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
      <h1 className="text-2xl font-bold mb-5">Gestion de la Maintenance</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          className="max-w-sm"
          placeholder="Rechercher un enregistrement de maintenance..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un enregistrement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] px-4">
            <DialogHeader>
              <DialogTitle>
                Ajouter un nouvel enregistrement de maintenance
              </DialogTitle>
              <DialogDescription>
                Entrez les détails du nouvel enregistrement de maintenance ici.
                Cliquez sur sauvegarder une fois terminé.
              </DialogDescription>
            </DialogHeader>
            <MaintenanceForm vehicles={vehicles} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("vehicle")}
                className="w-full justify-center"
              >
                Véhicule <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("date")}
                className="w-full justify-center"
              >
                Date <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("type")}
                className="w-full justify-center"
              >
                Type <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("cost")}
                className="w-full justify-center"
              >
                Coût <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMaintenanceRecords.map((record) => {
            const vehicle = vehicles.find((v) => v.id === record.vehicle);

            return (
              <TableRow key={record.id}>
                <TableCell className="text-center">
                  <div className="flex flex-col">
                    <span>{vehicle?.plate}</span>
                    <span className="text-xs">{vehicle?.Vnumber}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(record.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      record.type === "Repair"
                        ? "default"
                        : record.type === "Inspection"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {record.type === "Repair"
                      ? "Reparation"
                      : record.type === "Inspection"
                      ? "Inspection"
                      : "Entretien"}
                  </Badge>
                </TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell className="text-center">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                  }).format(record.cost)}
                </TableCell>
                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => setEditingMaintenance(record)}
                      >
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] px-4">
                      <DialogHeader>
                        <DialogTitle>
                          Modifier l&apos;enregistrement de maintenance
                        </DialogTitle>
                        <DialogDescription>
                          Modifiez les détails de l&apos;enregistrement de
                          maintenance ici. Cliquez sur sauvegarder une fois
                          terminé.
                        </DialogDescription>
                      </DialogHeader>
                      <MaintenanceForm
                        maintenanceRecord={editingMaintenance!}
                        vehicles={vehicles}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Enregistrements par page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
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
