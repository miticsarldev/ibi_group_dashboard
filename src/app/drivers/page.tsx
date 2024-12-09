/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
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
import { drivers } from "@/utils/data";
import { DriverForm } from "@/components/DriverForm";
import { Driver } from "@/types";
import { format } from "date-fns";

type SortColumn =
  | "name"
  | "phone"
  | "licenseNumber"
  | "email"
  | "status"
  | "rating"
  | "experienceYears"
  | "joinedDate";
type SortDirection = "asc" | "desc";

export default function DriversDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [sort, setSort] = useState<{
    column: SortColumn;
    direction: SortDirection;
  }>({ column: "name", direction: "asc" });

  // Filter drivers based on search term
  const filteredDrivers = drivers
    .filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Paginate drivers
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality here
    console.log(`Delete driver with id: ${id}`);
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
      <h1 className="text-2xl font-bold mb-5">Gestion des Conducteurs</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          className="max-w-sm"
          placeholder="Rechercher un conducteur..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un conducteur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau conducteur</DialogTitle>
              <DialogDescription>
                Entrez les détails du nouveau conducteur ici. Cliquez sur
                sauvegarder une fois terminé.
              </DialogDescription>
            </DialogHeader>
            <DriverForm />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="w-full justify-start"
              >
                Prénom & Nom <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("phone")}
                className="w-full justify-center"
              >
                Téléphone <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("licenseNumber")}
                className="w-full justify-center"
              >
                Nº Licence <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("experienceYears")}
                className="w-full justify-center"
              >
                Expériences <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("joinedDate")}
                className="w-full justify-center"
              >
                Date d&apos;adhésion <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-full justify-center items-center text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDrivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell className="text-center">
                <img
                  src={driver.image ?? "https://via.placeholder.com/150"}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full"
                />
              </TableCell>
              <TableCell className="text-center">{driver.name}</TableCell>
              <TableCell className="text-center">{driver.phone}</TableCell>
              <TableCell className="text-center">
                {driver.licenseNumber}
              </TableCell>
              <TableCell className="text-center">
                {driver.experienceYears} ans
              </TableCell>
              <TableCell className="text-center">
                {format(new Date(driver.joinedDate), "dd/MM/yyyy 'à' HH:mm")}
              </TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditingDriver(driver)}
                    >
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modifier le conducteur</DialogTitle>
                      <DialogDescription>
                        Modifiez les détails du conducteur ici. Cliquez sur
                        sauvegarder une fois terminé.
                      </DialogDescription>
                    </DialogHeader>
                    <DriverForm driver={editingDriver!} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(driver.id)}
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
          <span className="mr-2">Conducteurs par page:</span>
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
