"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Document, DocumentType, Driver, Vehicle } from "@/types";
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

type ExtendedTableMeta = {
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
};

export function getDocumentColumns(
  drivers: Driver[],
  vehicles: Vehicle[],
  documentTypes: DocumentType[]
) {
  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "type",
      header: "Type de Document",
      cell: ({ row }) => {
        const typeId = row.getValue("typeId") as string;
        const documentType = documentTypes.find((dt) => dt.id === typeId);
        return documentType ? documentType.name : "N/A";
      },
    },
    {
      accessorKey: "driverId",
      header: "Chauffeur",
      cell: ({ row }) => {
        const driverId = row.getValue("driverId") as string;
        const driver = drivers.find((d) => d.id === driverId);
        return driver ? driver.name : "N/A";
      },
    },
    {
      accessorKey: "vehicleId",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicleId = row.getValue("vehicleId") as string;
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        return vehicle ? `${vehicle.plate} (${vehicle.Vnumber})` : "N/A";
      },
    },
    {
      accessorKey: "expirationDate",
      header: "Date d'Expiration",
      cell: ({ row }) => {
        const date = row.getValue("expirationDate") as {
          toDate: () => Date;
        } | null;
        return date ? format(date.toDate(), "dd/MM/yyyy") : "N/A";
      },
    },
    {
      accessorKey: "isVerified",
      header: "Vérifié",
      cell: ({ row }) => {
        return row.getValue("isVerified") ? "Oui" : "Non";
      },
    },
    {
      accessorKey: "uploadDate",
      header: "Date de Téléchargement",
      cell: ({ row }) => {
        const date = row.getValue("uploadDate") as { toDate: () => Date };
        return format(date.toDate(), "dd/MM/yyyy HH:mm");
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const document = row.original;
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
                onClick={() => window.open(document.fileUrl, "_blank")}
              >
                Voir le Document
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => meta.onEdit(document)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => meta.onDelete(document.id)}>
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
