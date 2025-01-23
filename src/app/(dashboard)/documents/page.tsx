"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Document, DocumentType, Driver, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { DocumentForm } from "./document-form";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/firebase/firebase.services";
import { getDocumentColumns } from "./columns";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        fetchedDocuments,
        fetchedDrivers,
        fetchedVehicles,
        fetchedDocumentTypes,
      ] = await Promise.all([
        listDocuments<Document>("documents"),
        listDocuments<Driver>("drivers"),
        listDocuments<Vehicle>("vehicles"),
        listDocuments<DocumentType>("documentTypes"),
      ]);
      setDocuments(fetchedDocuments);
      setDrivers(fetchedDrivers);
      setVehicles(fetchedVehicles);
      setDocumentTypes(fetchedDocumentTypes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateDocument = async (documentData: Omit<Document, "id">) => {
    try {
      await createDocument("documents", { ...documentData, id: undefined });
      fetchData();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const handleUpdateDocument = async (documentData: Omit<Document, "id">) => {
    try {
      if (editingDocument) {
        updateDocument("documents", {
          ...documentData,
          id: editingDocument.id,
        });
        fetchData();
        setIsFormOpen(false);
        setEditingDocument(null);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument("documents", id);
      fetchData();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const columns = getDocumentColumns(drivers, vehicles, documentTypes);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Gestion des Documents</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Document
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader size="large" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={documents}
          onDelete={handleDeleteDocument}
          onEdit={(document) => {
            setEditingDocument(document);
            setIsFormOpen(true);
          }}
        />
      )}
      {isFormOpen && (
        <DocumentForm
          document={editingDocument!}
          onSubmit={
            editingDocument ? handleUpdateDocument : handleCreateDocument
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingDocument(null);
          }}
          isOpen={isFormOpen}
          drivers={drivers}
          vehicles={vehicles}
          documentTypes={documentTypes}
        />
      )}
    </div>
  );
}
