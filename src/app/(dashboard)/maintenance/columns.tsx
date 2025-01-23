"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceRecord, Vehicle } from "@/types";
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
import { Badge } from "@/components/ui/badge";

type ExtendedTableMeta = {
  vehicles: Vehicle[];
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
};

export function getMaintenanceColumns(
  vehicles: Vehicle[]
): ColumnDef<MaintenanceRecord>[] {
  const columns: ColumnDef<MaintenanceRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as { toDate: () => Date };
        return format(date.toDate(), "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "vehicle",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicleId = row.getValue("vehicle") as string;
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        // return vehicle ? `${vehicle.plate} (${vehicle.Vnumber})` : "N/A";
        return (
          <div className="flex flex-col">
            <span className="text-xs">{vehicle?.Vnumber}</span>
            <span>{vehicle?.plate}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "cost",
      header: "Coût",
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue("cost"));
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
        }).format(cost);
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type");
        return (
          <Badge
            variant={
              type === "Repair"
                ? "destructive"
                : type === "Inspection"
                ? "secondary"
                : "default"
            }
          >
            {type === "Repair"
              ? "Reparation"
              : type === "Inspection"
              ? "Inspection"
              : "Entretien"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const maintenance = row.original;
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
                onClick={() => navigator.clipboard.writeText(maintenance.id)}
              >
                Copier l&apos;ID de la maintenance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => meta.onEdit(maintenance)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => meta.onDelete(maintenance.id)}>
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
