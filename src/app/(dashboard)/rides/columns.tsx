"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ride } from "@/types";
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
  onEdit: (ride: Ride) => void;
  onDelete: (id: string) => void;
};

export const columns: ColumnDef<Ride>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "passenger",
    header: "Passager",
  },
  {
    accessorKey: "driver",
    header: "Chauffeur",
  },
  {
    accessorKey: "startTime",
    header: "Heure de départ",
    cell: ({ row }) => {
      const startTime = row.getValue("startTime") as { toDate: () => Date };
      return startTime.toDate().toLocaleString();
    },
  },
  {
    accessorKey: "endTime",
    header: "Heure d'arrivée",
    cell: ({ row }) => {
      const endTime = row.getValue("endTime") as
        | { toDate: () => Date }
        | undefined;
      return endTime ? endTime.toDate().toLocaleString() : "En cours";
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Completed" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fare",
    header: "Tarif",
    cell: ({ row }) => {
      const fare = parseFloat(row.getValue("fare"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
      }).format(fare);
      return formatted;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const ride = row.original;
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
              onClick={() => navigator.clipboard.writeText(ride.id)}
            >
              Copier l&apos;ID de la course
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(ride)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(ride.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
