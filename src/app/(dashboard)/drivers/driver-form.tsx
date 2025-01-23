/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaxiDriver } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Timestamp } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface TaxiDriverFormProps {
  driver?: TaxiDriver;
  onSubmit: (driverData: Omit<TaxiDriver, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  image: z.string().optional(),
  phoneNumber: z.string().min(10, {
    message: "Le numéro de téléphone doit contenir au moins 10 chiffres.",
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  licenseNumber: z.string().min(5, {
    message: "Le numéro de permis doit contenir au moins 5 caractères.",
  }),
  status: z.enum(["Active", "Inactive", "Suspension"] as const),
  experienceYears: z.string(),
  onDuty: z.boolean(),
  isActive: z.boolean(),
  isApprouved: z.boolean(),
  vehicleType: z.enum(["car", "bike"]),
  vehicleOptions: z.enum(["IBI Electric", "Economique", "Premium"]),
  vehicleColor: z.string(),
  vehicleNumber: z.string(),
  vehiclePassengers: z.number().min(0),
});

export function TaxiDriverForm({
  driver,
  onSubmit,
  onCancel,
  isOpen,
}: TaxiDriverFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    driver?.image || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: driver?.displayName || "",
      email: driver?.email || "",
      phoneNumber: driver?.phoneNumber || "",
      address: driver?.address || "",
      licenseNumber: driver?.licenseNumber || "",
      status: driver?.status || "Active",
      experienceYears: driver?.experienceYears || "0",
      isActive: driver?.isActive || true,
      image: driver?.image || "",
      onDuty: driver?.onDuty || false,
      isApprouved: driver?.isApprouved || false,
      vehicleType: driver?.vehicleType || "car",
      vehicleOptions: driver?.vehicleOptions || "IBI Electric",
      vehicleColor: driver?.vehicleColor || "",
      vehicleNumber: driver?.vehicleNumber || "",
      vehiclePassengers: driver?.vehiclePassengers || 0,
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  async function uploadImageToImgBB(file: File): Promise<string> {
    const MAX_FILE_SIZE_MB = 10; // Maximum file size in megabytes
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`
      );
    }

    const { data: signature } = await axios.post("/api/cloudinary-signature");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("signature", signature.signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  }

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let imageUrl = values.image;
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const driverData: Omit<TaxiDriver, "id"> = {
        ...values,
        onDuty: false,
        userType: "driver", // add this property (or some other default value)
        vehicleType: "",
        image: imageUrl,
        joinedDate: driver?.joinedDate || Timestamp.fromDate(new Date()),
      };
      await onSubmit(driverData);
      toast({
        title: "Succès",
        description: "Les informations du chauffeur ont été enregistrées.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      console.log(error);
      if (
        error instanceof Error &&
        error.message === "Failed to upload image"
      ) {
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de l'enregistrement de l'image.",
          variant: "destructive",
        });
      } else if (
        error instanceof Error &&
        error.message === "File size exceeds the maximum limit"
      ) {
        toast({
          title: "Erreur",
          description:
            "La taille du fichier dépasse la limite maximale autorisée.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de l'enregistrement des informations.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px] p-3">
        <DialogHeader>
          <DialogTitle>
            {driver ? "Modifier le chauffeur" : "Ajouter un chauffeur"}
          </DialogTitle>
          {driver ? (
            <DialogDescription>
              Modifiez les détails du chauffeur ici. Cliquez sur sauvegarder une
              fois terminé.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Entrez les détails du nouveau chauffeur ici. Cliquez sur
              sauvegarder une fois terminé.
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
              name="image"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo du chauffeur</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      {imagePreview && (
                        <div className="shrink-0">
                          <img
                            src={imagePreview}
                            alt="Driver preview"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        {...getRootProps()}
                        className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-14 ${
                          isDragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p className="text-sm text-gray-500">
                            Déposez l&#39;image ici ...
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 text-center">
                            Glissez et déposez une image ici, ou cliquez pour
                            sélectionner
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Téléchargez une photo du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez le nom complet du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez l&apos;adresse email du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+223 77 77 77 77" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez le numéro de téléphone du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adresse du chauffeur, exemple : Hamdallaye ACI, Rue 1, Quartier 1"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez l&apos;adresse complète du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de permis</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez le numéro de permis du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Actif</SelectItem>
                      <SelectItem value="Inactive">Inactif</SelectItem>
                      <SelectItem value="Suspension">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez le statut du chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Années d&apos;expérience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez le nombre d&apos;années d&apos;expérience du
                    chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Cochez cette case si le chauffeur est actif.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isApprouved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Chauffeur approuvé ?</FormLabel>
                    <FormDescription>
                      Cochez cette case pour approuver un chauffeur pour
                      qu&apos;il puisser utiliser l&apos;application de commande
                      de taxi.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de vehicule</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de vehicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="car">Voiture</SelectItem>
                      <SelectItem value="bike">Moto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez le type de vehicule que disposera le chauffeur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'option du vehicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IBI Electric">
                        IBI Electrique
                      </SelectItem>
                      <SelectItem value="Economique">Economique</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez une option de vehicule que dispose le chauffeur
                    (IBI Electric, Economique, Premium).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>La couleur du vehicule</FormLabel>
                  <FormControl>
                    <Input placeholder="CC 6666 DD" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez le numéro de plaque du vehicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>La couleur du vehicule</FormLabel>
                  <FormControl>
                    <Input placeholder="Noir" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez la couleur du vehicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehiclePassengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>La couleur du vehicule</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Noir"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez la couleur du vehicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
