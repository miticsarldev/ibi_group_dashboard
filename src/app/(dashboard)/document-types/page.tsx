"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { DocumentType } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { columns } from "./columns";
import { DocumentTypeForm } from "./document-types-form";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";

export default function DocumentTypesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocumentType, setEditingDocumentType] =
    useState<DocumentType | null>(null);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    setIsLoading(true);
    try {
      const fetchedDocumentTypes = await listDocuments<DocumentType>(
        "documentTypes"
      );
      setDocumentTypes(fetchedDocumentTypes);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
    setIsLoading(false);
  };

  const handleCreateDocumentType = async (
    documentTypeData: Omit<DocumentType, "id">
  ) => {
    try {
      await createDocument("documentTypes", {
        ...documentTypeData,
        id: undefined,
      });
      fetchDocumentTypes();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating document type:", error);
    }
  };

  const handleUpdateDocumentType = async (
    documentTypeData: Omit<DocumentType, "id">
  ) => {
    try {
      if (editingDocumentType) {
        await updateDocument("documentTypes", {
          ...documentTypeData,
          id: editingDocumentType.id,
        });
        fetchDocumentTypes();
        setIsFormOpen(false);
        setEditingDocumentType(null);
      }
    } catch (error) {
      console.error("Error updating document type:", error);
    }
  };

  const handleDeleteDocumentType = async (id: string) => {
    try {
      await deleteDocument("documentTypes", id);
      fetchDocumentTypes();
    } catch (error) {
      console.error("Error deleting document type:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Types de Documents</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Type de Document
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={documentTypes}
          onDelete={handleDeleteDocumentType}
          onEdit={(documentType) => {
            setEditingDocumentType(documentType);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <DocumentTypeForm
          documentType={editingDocumentType!}
          onSubmit={
            editingDocumentType
              ? handleUpdateDocumentType
              : handleCreateDocumentType
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingDocumentType(null);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
