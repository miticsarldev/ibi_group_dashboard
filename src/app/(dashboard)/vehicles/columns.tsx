/* eslint-disable @next/next/no-img-element */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/types";
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

// Define the extended TableMeta type
type ExtendedTableMeta = {
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
};

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "image",
    header: "Icône",
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <div className="flex items-center justify-center">
          <img
            src={vehicle.type === "bike" ? "/bike-icon.png" : "/car-icon.png"}
            className={
              vehicle.type === "bike"
                ? "h-6 w-6 -rotate-45"
                : "h-12 w-8 rotate-90"
            }
            alt={vehicle.type}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "Vnumber",
    header: "Numéro de Véhicule",
    enableSorting: true,
  },
  {
    accessorKey: "plate",
    header: "Numéro de Plaque",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const vehicle = row.original;
      return vehicle.type === "car" ? "Voiture" : "Moto";
    },
  },
  {
    accessorKey: "vOptions",
    header: "Options",
    cell: ({ row }) => {
      const vehicle = row.original;
      const variant =
        vehicle.vOptions === "IBI Electric"
          ? "outline"
          : vehicle.vOptions === "Economique"
          ? "secondary"
          : "destructive";

      const bgColor = {
        "IBI Electric": "bg-ibi-color-3",
        Economique: "bg-ibi-color-4",
        Premium: "bg-ibi-color-5",
        default: "bg-ibi-color-6",
      };

      return (
        <Badge
          className={`${bgColor[vehicle?.vOptions ?? "default"]} ibi`}
          variant={variant}
        >
          {vehicle.vOptions}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "isElectric",
    header: "Electrique",
    cell: ({ row }) => {
      const isElectric = row.original.isElectric;

      return isElectric ? (
        <Badge className="capitalize bg-ibi-color-3">oui</Badge>
      ) : (
        <Badge className="capitalize bg-ibi-color-4">non</Badge>
      );
    },
  },
  {
    accessorKey: "batteryLevel",
    header: "Batterie %",
    cell: ({ row }) => {
      const batteryLevel = row.getValue("batteryLevel") as number | undefined;
      return batteryLevel !== undefined ? `${batteryLevel}%` : "N/A";
    },
  },
  {
    accessorKey: "estimatedRange",
    header: "Distance (KM)",
    cell: ({ row }) => {
      const range = row.getValue("estimatedRange") as number | undefined;
      return range !== undefined ? `${range} km` : "N/A";
    },
  },
  {
    accessorKey: "position",
    header: "Localisation",
    cell: ({ row }) => {
      const location = row.getValue("position") as [number, number];
      return `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const vehicle = row.original;
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
              onClick={() => navigator.clipboard.writeText(vehicle.id)}
            >
              Copier l&apos;ID du véhicule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(vehicle)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(vehicle.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
