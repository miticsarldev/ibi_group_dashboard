"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
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
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleMap: { [key: string]: string } = {
        admin: "Administrateur",
        dispatcher: "Répartiteur",
        driver: "Chauffeur",
        taxi_driver: "Chauffeur de Taxi",
      };
      return roleMap[role] || role;
    },
  },
  {
    accessorKey: "isActive",
    header: "Actif",
    cell: ({ row }) => {
      return row.getValue("isActive") ? "Oui" : "Non";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date de création",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as { toDate: () => Date };
      return format(date.toDate(), "dd/MM/yyyy HH:mm");
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Dernière connexion",
    cell: ({ row }) => {
      const date = row.getValue("lastLogin") as
        | { toDate: () => Date }
        | undefined;
      return date ? format(date.toDate(), "dd/MM/yyyy HH:mm") : "Jamais";
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copier l&apos;ID de l&apos;utilisateur
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(user.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
