"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Passenger } from "@/types";
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

type ExtendedTableMeta = {
  onEdit: (passenger: Passenger) => void;
  onDelete: (id: string) => void;
};

export const columns: ColumnDef<Passenger>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "walletBalance",
    header: "Solde du portefeuille",
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("walletBalance"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
      }).format(balance);
      return formatted;
    },
  },
  {
    accessorKey: "joinedDate",
    header: "Date d'inscription",
    cell: ({ row }) => {
      const joinedDate = row.getValue("joinedDate") as { toDate: () => Date };
      return joinedDate.toDate().toLocaleDateString();
    },
  },
  {
    accessorKey: "rideHistory",
    header: "Nombre de courses",
    cell: ({ row }) => {
      const rideHistory = row.getValue("rideHistory") as string[];
      return rideHistory.length;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const passenger = row.original;
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
              onClick={() => navigator.clipboard.writeText(passenger.id)}
            >
              Copier l&apos;ID du passager
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(passenger)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(passenger.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
