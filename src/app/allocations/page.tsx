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
import { allocations, drivers, vehicles } from "@/utils/data";
import { AllocationForm } from "@/components/AllocationForm";
import { Allocation } from "@/types";

type SortColumn =
  | "driver"
  | "vehicle"
  | "startDate"
  | "endDate"
  | "status"
  | "type";
type SortDirection = "asc" | "desc";

export default function AllocationsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(
    null
  );
  const [sort, setSort] = useState<{
    column: SortColumn;
    direction: SortDirection;
  }>({ column: "startDate", direction: "desc" });

  // Filter allocations based on search term
  const filteredAllocations = allocations
    .filter(
      (allocation) =>
        drivers
          .find((d) => d.id === allocation.driver)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        allocation.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allocation.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allocation.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sort.column) {
        let valueA, valueB;
        if (sort.column === "driver") {
          valueA = drivers.find((d) => d.id === a.driver)?.name || "";
          valueB = drivers.find((d) => d.id === b.driver)?.name || "";
        } else {
          valueA = a[sort.column];
          valueB = b[sort.column];
        }
        if (valueA < valueB) return sort.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Paginate allocations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAllocations = filteredAllocations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality here
    console.log(`Delete allocation with id: ${id}`);
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
      <h1 className="text-2xl font-bold mb-5">Gestion des Allocations</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          className="max-w-sm"
          placeholder="Rechercher une allocation..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter une allocation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle allocation</DialogTitle>
              <DialogDescription>
                Entrez les détails de la nouvelle allocation ici. Cliquez sur
                sauvegarder une fois terminé.
              </DialogDescription>
            </DialogHeader>
            <AllocationForm drivers={drivers} vehicles={vehicles} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("driver")}
                className="w-full justify-center"
              >
                Conducteur <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
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
                onClick={() => handleSort("startDate")}
                className="w-full justify-center"
              >
                Date de début <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("endDate")}
                className="w-full justify-center"
              >
                Date de fin <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="w-full justify-center"
              >
                Statut <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentAllocations.map((allocation) => (
            <TableRow key={allocation.id}>
              <TableCell className="text-center">
                {drivers.find((d) => d.id === allocation.driver)?.name}
              </TableCell>
              <TableCell className="text-center">
                {allocation.vehicle}
              </TableCell>
              <TableCell className="text-center">
                {format(new Date(allocation.startDate), "dd/MM/yyyy 'à' HH:mm")}
              </TableCell>
              <TableCell className="text-center">
                {format(new Date(allocation.endDate), "dd/MM/yyyy 'à' HH:mm")}
              </TableCell>
              <TableCell className="text-center">{allocation.status}</TableCell>
              <TableCell className="text-center">{allocation.type}</TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditingAllocation(allocation)}
                    >
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modifier l&apos;allocation</DialogTitle>
                      <DialogDescription>
                        Modifiez les détails de l&apos;allocation ici. Cliquez
                        sur sauvegarder une fois terminé.
                      </DialogDescription>
                    </DialogHeader>
                    <AllocationForm
                      allocation={editingAllocation!}
                      drivers={drivers}
                      vehicles={vehicles}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(allocation.id)}
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
          <span className="mr-2">Allocations par page:</span>
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
