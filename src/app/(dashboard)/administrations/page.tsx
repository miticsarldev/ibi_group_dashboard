"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UserForm } from "./user-form";
import { useToast } from "@/hooks/use-toast";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { Loader } from "@/components/ui/loader";

export default function AdministrationsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await listDocuments<User>("users");
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast, setUsers, setIsLoading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (userData: Omit<User, "id">) => {
    try {
      await createDocument("users", { ...userData, id: undefined });
      await fetchUsers();
      setIsFormOpen(false);
      toast({
        title: "Succès",
        description: "L'utilisateur a été créé avec succès.",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userData: Omit<User, "id">) => {
    try {
      if (editingUser) {
        await updateDocument("users", { ...userData, id: editingUser.id });
        fetchUsers();
        setIsFormOpen(false);
        setEditingUser(null);
        toast({
          title: "Succès",
          description: "L'utilisateur a été mis à jour avec succès.",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDocument("users", id);
      fetchUsers();
      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Utilisateur
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onEdit={(user) => {
            setEditingUser(user);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteUser}
        />
      )}
      {isFormOpen && (
        <UserForm
          user={editingUser!}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
