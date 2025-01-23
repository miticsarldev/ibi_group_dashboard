"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Document, Driver, Vehicle, DocumentType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Timestamp } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";

interface DocumentFormProps {
  document?: Document;
  onSubmit: (documentData: Omit<Document, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  drivers: Driver[];
  vehicles: Vehicle[];
  documentTypes: DocumentType[];
}

const formSchema = z.object({
  driverId: z.string().min(1, { message: "Le chauffeur est requis." }),
  vehicleId: z.string().optional(),
  typeId: z.string().min(1, { message: "Le type de document est requis." }),
  expirationDate: z.date().nullable(),
  isVerified: z.boolean(),
  notes: z.string().optional(),
});

export function DocumentForm({
  document,
  onSubmit,
  onCancel,
  isOpen,
  drivers,
  vehicles,
  documentTypes,
}: DocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [openDriver, setOpenDriver] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);
  const [openDocumentTypes, setOpenDocumentTypes] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driverId: document?.driverId || "",
      vehicleId: document?.vehicleId || undefined,
      typeId: document?.typeId || "",
      expirationDate: document?.expirationDate?.toDate() || null,
      isVerified: document?.isVerified || false,
      notes: document?.notes || "",
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let fileUrl = document?.fileUrl || "";
      if (file) {
        // Here you would typically upload the file to your storage (e.g., Firebase Storage)
        // and get the URL. For this example, we'll just use a placeholder.
        fileUrl = URL.createObjectURL(file);
      }

      const documentData: Omit<Document, "id"> = {
        ...values,
        fileUrl,
        expirationDate: values.expirationDate
          ? Timestamp.fromDate(values.expirationDate)
          : null,
        uploadDate: document?.uploadDate || Timestamp.now(),
        notes: values.notes || "",
      };

      await onSubmit(documentData);
      toast({
        title: "Succès",
        description: "Le document a été enregistré.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement du document.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px] p-3">
        <DialogHeader>
          <DialogTitle>
            {document ? "Modifier le document" : "Ajouter un document"}
          </DialogTitle>
          {document ? (
            <DialogDescription>
              Modifiez les détails du document ici. Cliquez sur sauvegarder une
              fois terminé.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Entrez les détails du document ici. Cliquez sur sauvegarder une
              fois terminé.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 max-h-[70vh] overflow-y-auto p-1"
          >
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => {
                const selectedDriver = drivers?.find(
                  (driver) => driver.id.toString() === field.value
                );

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Conducteur</FormLabel>
                    <Popover open={openDriver} onOpenChange={setOpenDriver}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDriver}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? `${selectedDriver?.name} - ${selectedDriver?.phone}`
                              : "Sélectionnez un conducteur"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher un conducteur..." />
                          <CommandEmpty>Aucun conducteur trouvé.</CommandEmpty>
                          <CommandList>
                            {drivers?.map((driver) => (
                              <CommandItem
                                key={driver.id}
                                value={
                                  driver.name.toString() +
                                  " - " +
                                  driver.phone.toString()
                                }
                                onSelect={() => {
                                  form.setValue(
                                    "driverId",
                                    driver.id.toString()
                                  );
                                  setOpenDriver(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === driver.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {driver.name} - {driver.phone}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Choisissez le conducteur pour cette allocation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => {
                const selectedVehicle = vehicles?.find(
                  (vehicle) => vehicle?.id?.toString() === field.value
                );

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Véhicule</FormLabel>
                    <Popover open={openVehicle} onOpenChange={setOpenVehicle}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openVehicle}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? `${selectedVehicle?.plate} - ${selectedVehicle?.Vnumber}`
                              : "Sélectionnez un véhicule"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher un véhicule..." />
                          <CommandEmpty>Aucun véhicule trouvé.</CommandEmpty>
                          <CommandList>
                            {vehicles?.map((vehicle) => (
                              <CommandItem
                                key={vehicle.id}
                                value={
                                  vehicle?.plate.toString() +
                                  " - " +
                                  vehicle?.Vnumber
                                }
                                onSelect={() => {
                                  form.setValue(
                                    "vehicleId",
                                    vehicle.id.toString()
                                  );
                                  setOpenVehicle(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === vehicle.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {vehicle.plate} - {vehicle.Vnumber}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Choisissez le véhicule pour cette allocation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => {
                const selectedType = documentTypes?.find(
                  (document) => document?.id?.toString() === field.value
                );

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Type de document</FormLabel>
                    <Popover
                      open={openDocumentTypes}
                      onOpenChange={setOpenDocumentTypes}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDocumentTypes}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? `${selectedType?.name}`
                              : "Sélectionnez un type de document"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher un type de document..." />
                          <CommandEmpty>
                            Aucun type de document trouvé.
                          </CommandEmpty>
                          <CommandList>
                            {documentTypes?.map((document) => (
                              <CommandItem
                                key={document.id}
                                value={document?.name.toString()}
                                onSelect={() => {
                                  form.setValue(
                                    "typeId",
                                    document.id.toString()
                                  );
                                  setOpenDocumentTypes(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === document.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {document.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Choisissez le véhicule pour cette allocation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="expirationDate"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date d&apos;Expiration</FormLabel>
                  <FormControl>
                    <Controller
                      name="expirationDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          isClearable
                        />
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Sélectionnez la date d&apos;expiration du document (si
                    applicable).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Vérifié</FormLabel>
                    <FormDescription>
                      Cochez cette case si le document a été vérifié.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Ajoutez des notes supplémentaires si nécessaire.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Déposez le fichier ici ...</p>
              ) : (
                <p>
                  Glissez et déposez un fichier ici, ou cliquez pour
                  sélectionner un fichier
                </p>
              )}
              {file && <p>Fichier sélectionné: {file.name}</p>}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isSubmitting ? "Envoi en cours..." : "Sauvegarder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
