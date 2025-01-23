"use client";

import { useState } from "react";
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
import { ChargingStation } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ChargingStationFormProps {
  station?: ChargingStation;
  onSubmit: (stationData: Omit<ChargingStation, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  availablePlugs: z.number().min(0),
  totalPlugs: z.number().min(1),
  pricePerCharge: z.number().min(0),
  operatingHours: z.string().optional(),
});

export function ChargingStationForm({
  station,
  onSubmit,
  onCancel,
  isOpen,
}: ChargingStationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: station?.name || "",
      latitude: station?.location[0] || 0,
      longitude: station?.location[1] || 0,
      availablePlugs: station?.availablePlugs || 0,
      totalPlugs: station?.totalPlugs || 1,
      pricePerCharge: station?.pricePerCharge || 0,
      operatingHours: station?.operatingHours || "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const stationData: Omit<ChargingStation, "id"> = {
        name: values.name,
        location: [values.latitude, values.longitude],
        availablePlugs: values.availablePlugs,
        totalPlugs: values.totalPlugs,
        pricePerCharge: values.pricePerCharge,
        operatingHours: values.operatingHours,
      };
      await onSubmit(stationData);
      toast({
        title: "Succès",
        description: "La station de recharge a été enregistrée.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement de la station.",
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
            {station ? "Modifier la station" : "Ajouter une station"}
          </DialogTitle>
          {station ? (
            <DialogDescription>
              Modifiez les détails de la station ici. Cliquez sur sauvegarder
              une fois terminé.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Entrez les détails de la nouvelle station ici. Cliquez sur
              sauvegarder une fois terminé.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 p-1 overflow-y-auto max-h-[70vh]"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez le nom de la station de recharge.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
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
                    Entrez la latitude de la station.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
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
                    Entrez la longitude de la station.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availablePlugs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prises Disponibles</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez le nombre de prises actuellement disponibles.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalPlugs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total des Prises</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez le nombre total de prises de la station.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricePerCharge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix par Charge</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez le prix par charge en FCFA.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operatingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures d&apos;Ouverture</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez les heures d&apos;ouverture de la station{" "}
                    {'(ex: "24/7" ou "8h-20h")'}.
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
