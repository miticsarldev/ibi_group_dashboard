"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Vehicle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGlobalParameters } from "@/contexts/GlobalParametersContext";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (vehicleData: Omit<Vehicle, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  type: z.enum(["car", "bike"] as const),
  plate: z.string().min(2, {
    message: "La plaque d'immatriculation doit contenir au moins 2 caractères.",
  }),
  Vnumber: z.string().min(1, {
    message: "Le numéro de véhicule est requis.",
  }),
  status: z.enum([
    "En service",
    "En maintenance",
    "Disponible",
    "Inactive",
  ] as const),
  positionLat: z.number().min(-90).max(90),
  positionLng: z.number().min(-180).max(180),
  batteryLevel: z.number().min(0).max(100).optional(),
  estimatedRange: z.number().min(0).optional(),
  vOptions: z
    .enum(["IBI Electric", "Economique", "Premium"] as const)
    .optional(),
  isElectric: z.boolean(),
});

export function VehicleForm({
  vehicle,
  onSubmit,
  onCancel,
  isOpen,
}: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { parameters } = useGlobalParameters();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: vehicle?.type || "car",
      plate: vehicle?.plate || "",
      Vnumber: vehicle?.Vnumber || "",
      status: vehicle?.status || "Inactive",
      positionLat: vehicle?.position?.[0] || 0,
      positionLng: vehicle?.position?.[1] || 0,
      batteryLevel: vehicle?.batteryLevel || 100,
      estimatedRange:
        vehicle?.type === "car"
          ? parseInt(parameters.estimatedRangeCar)
          : parseInt(parameters.estimatedRangeMotorbike),
      vOptions: vehicle?.vOptions || "IBI Electric",
      isElectric: vehicle?.isElectric || false,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const vehicleData: Omit<Vehicle, "id"> = {
        type: values.type,
        plate: values.plate,
        Vnumber: values.Vnumber,
        status: values.status,
        position: [values.positionLat, values.positionLng],
        batteryLevel: values.batteryLevel,
        estimatedRange: values.estimatedRange,
        vOptions: values.vOptions,
        isElectric: values.isElectric,
      };
      await onSubmit(vehicleData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px] p-3">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
          </DialogTitle>
          {vehicle ? (
            <DialogDescription>
              Modifiez les détails du véhicule ici. Cliquez sur sauvegarder une
              fois terminé.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Entrez les détails du nouveau véhicule ici. Cliquez sur
              sauvegarder une fois terminé.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 max-h-[70vh] overflow-y-auto p-1"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de véhicule</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="car">Voiture</SelectItem>
                      <SelectItem value="bike">Moto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez le type de véhicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isElectric"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Véhicule électrique (IBI GROUP)</FormLabel>
                    <FormDescription>
                      Cochez cette case si le véhicule est électrique.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plaque d&apos;immatriculation</FormLabel>
                  <FormControl>
                    <Input placeholder="BA 1234 MD" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez la plaque d&apos;immatriculation du véhicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Vnumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de véhicule</FormLabel>
                  <FormControl>
                    <Input placeholder="AX454656" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez le numéro de véhicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option du Véhicule</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez l'option du véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IBI Electric">
                          IBI Eléctrique
                        </SelectItem>
                        <SelectItem value="Economique">Economique</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choisissez l&apos;option du véhicule.
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Inactive">Inactif</SelectItem>
                        <SelectItem value="En service">En service</SelectItem>
                        <SelectItem value="En maintenance">
                          En maintenance
                        </SelectItem>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choisissez le statut actuel du véhicule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("vOptions") === "IBI Electric" && (
              <>
                <FormField
                  control={form.control}
                  name="positionLat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Entrez la latitude de la position du véhicule.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="positionLng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Entrez la longitude de la position du véhicule.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {form.watch("isElectric") && (
              <>
                <FormField
                  control={form.control}
                  name="batteryLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de batterie (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Entrez le niveau de batterie du véhicule (0-100).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autonomie estimée (km)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Entrez l&apos;autonomie estimée du véhicule en
                        kilomètres.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
