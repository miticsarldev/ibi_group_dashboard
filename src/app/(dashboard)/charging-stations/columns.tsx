"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChargingStation } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type ExtendedTableMeta = {
  onEdit: (station: ChargingStation) => void;
  onDelete: (id: string) => void;
};

export const columns: ColumnDef<ChargingStation>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "location",
    header: "Localisation",
    cell: ({ row }) => {
      const location = row.getValue("location") as [number, number];
      return `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`;
    },
  },
  {
    accessorKey: "availablePlugs",
    header: "Prises Disponibles",
    cell: ({ row }) => {
      const station = row.original;
      return (
        <Badge variant={station.availablePlugs > 0 ? "default" : "destructive"}>
          {station.availablePlugs}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalPlugs",
    header: "Total des Prises",
    cell: ({ row }) => {
      const station = row.original;
      return (
        <Badge variant={station.totalPlugs > 0 ? "secondary" : "destructive"}>
          {station.totalPlugs}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pricePerCharge",
    header: "Prix par Charge",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("pricePerCharge"));
      return `${price.toFixed(2)} FCFA`;
    },
  },
  {
    accessorKey: "operatingHours",
    header: "Heures d'Ouverture",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const station = row.original;
      const meta = table.options.meta as ExtendedTableMeta;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(station.id)}
            >
              Copier l&apos;ID de la station
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(station)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(station.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
