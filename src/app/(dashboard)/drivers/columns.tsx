"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TaxiDriver } from "@/types";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ExtendedTableMeta = {
  onEdit: (driver: TaxiDriver) => void;
  onDelete: (id: string) => void;
};

export const columns: ColumnDef<TaxiDriver>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const driver = row.original;
      return (
        <div className="flex items-center justify-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={driver.image} alt={driver.displayName} />
            <AvatarFallback className="bg-muted">
              {driver.displayName
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "displayName",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Téléphone",
  },
  {
    accessorKey: "isApprouved",
    header: "Approuvé",
    cell: ({ row }) => {
      const isApprouved = row.getValue("isApprouved");
      return isApprouved ? (
        <Badge variant="default">Oui</Badge>
      ) : (
        <Badge variant="destructive">Non</Badge>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => {
      const driver = row.original;
      return (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span>{driver.address}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "licenseNumber",
    header: "Numéro de Permis",
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating") ?? "0");
      return rating.toFixed(1);
    },
  },
  {
    accessorKey: "isActive",
    header: "Actif",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return isActive ? "Oui" : "Non";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const driver = row.original;
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
              onClick={() => navigator.clipboard.writeText(driver?.id ?? "")}
            >
              Copier l&apos;ID du chauffeur
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(driver)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(driver.id ?? "")}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
