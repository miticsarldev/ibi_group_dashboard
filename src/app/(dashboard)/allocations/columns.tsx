/* eslint-disable @next/next/no-img-element */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Allocation, Driver, Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ExtendedTableMeta = {
  onEdit: (allocation: Allocation) => void;
  onDelete: (id: string) => void;
};

export function getAllocationColumns(drivers: Driver[], vehicles: Vehicle[]) {
  const columns: ColumnDef<Allocation>[] = [
    {
      accessorKey: "driver",
      header: "Allocateur",
      cell: ({ row }) => {
        const driverId = row.getValue("driver") as string;
        const driver = drivers.find((d) => d.id === driverId);
        return driver ? (
          <div className="flex flex-row items-center justify-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={driver.image} alt={driver.name} />
              <AvatarFallback className="bg-muted">
                {driver.name
                  .split(" ")
                  .map((name) => name.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{driver?.name}</span>
              <span className="text-xs">{driver?.phone}</span>
            </div>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      accessorKey: "vehicle",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicleId = row.getValue("vehicle") as string;
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        return vehicle ? (
          <div className="flex flex-col">
            <span>{`${vehicle?.plate} - ${vehicle?.Vnumber}`}</span>
            <span className="text-xs">
              {vehicle?.type === "car" ? "Voiture" : "Moto"}
            </span>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      accessorKey: "isPaid",
      header: "Payé",
      cell: ({ row }) => {
        const isPaid = row.getValue("isPaid");
        return isPaid ? (
          <Badge variant="default">Payé</Badge>
        ) : (
          <Badge variant="destructive">Non payé</Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Date de début",
      cell: ({ row }) => {
        const date = row.getValue("startDate") as { toDate: () => Date };
        return (
          <div className="flex flex-col">
            <span>{format(new Date(date.toDate()), "dd/MM/yyyy")}</span>
            <span className="text-xs">
              {format(new Date(date.toDate()), "HH:mm")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "Date de fin",
      cell: ({ row }) => {
        const date = row.getValue("endDate") as { toDate: () => Date };
        return (
          <div className="flex flex-col">
            <span>{format(new Date(date.toDate()), "dd/MM/yyyy")}</span>
            <span className="text-xs">
              {format(new Date(date.toDate()), "HH:mm")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        let content;

        if (status === "Active") {
          content = <Badge variant="default">En cours</Badge>;
        } else if (status === "Cancelled") {
          content = <Badge variant="destructive">Annulé</Badge>;
        } else if (status === "Completed") {
          content = <Badge variant="secondary">Terminé</Badge>;
        } else if (status === "Scheduled") {
          content = <Badge variant="outline">Planifié</Badge>;
        }

        return content;
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const allocation = row.original;
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
                onClick={() => navigator.clipboard.writeText(allocation.id)}
              >
                Copier l&apos;ID de l&apos;allocation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => meta.onEdit(allocation)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => meta.onDelete(allocation.id)}>
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
