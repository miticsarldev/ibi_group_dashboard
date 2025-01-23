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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ride, Driver, Passenger } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Timestamp } from "firebase/firestore";

interface RideFormProps {
  ride?: Ride;
  onSubmit: (rideData: Omit<Ride, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  drivers: Driver[];
  passengers: Passenger[];
}

const formSchema = z.object({
  passenger: z.string().min(1, { message: "Le passager est requis." }),
  driver: z.string().min(1, { message: "Le chauffeur est requis." }),
  vehicle: z.string().min(1, { message: "Le véhicule est requis." }),
  startLocation: z.tuple([
    z.number().min(-90).max(90),
    z.number().min(-180).max(180),
  ]),
  endLocation: z.tuple([
    z.number().min(-90).max(90),
    z.number().min(-180).max(180),
  ]),
  distance: z.number().min(0),
  startTime: z.date(),
  endTime: z.date().optional(),
  status: z.enum(["Pending", "Ongoing", "Completed", "Cancelled"]),
  fare: z.number().min(0),
  paymentMethod: z.enum(["Card", "Cash", "Wallet"]),
  rating: z.number().min(1).max(5).optional(),
});

export function RideForm({
  ride,
  onSubmit,
  onCancel,
  isOpen,
  drivers,
  passengers,
}: RideFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passenger: ride?.passenger || "",
      driver: ride?.driver || "",
      vehicle: ride?.vehicle || "",
      startLocation: ride?.startLocation || [0, 0],
      endLocation: ride?.endLocation || [0, 0],
      distance: ride?.distance || 0,
      startTime: ride?.startTime ? ride.startTime.toDate() : new Date(),
      endTime: ride?.endTime ? ride.endTime.toDate() : undefined,
      status: ride?.status || "Pending",
      fare: ride?.fare || 0,
      paymentMethod: ride?.paymentMethod || "Cash",
      rating: ride?.rating,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const rideData: Omit<Ride, "id"> = {
        ...values,
        startTime: Timestamp.fromDate(values.startTime),
        endTime: values.endTime
          ? Timestamp.fromDate(values.endTime)
          : undefined,
      };
      await onSubmit(rideData);
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
            {ride ? "Modifier la course" : "Ajouter une course"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 max-h-[70vh] overflow-y-auto p-1"
          >
            <FormField
              control={form.control}
              name="passenger"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passager</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un passager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {passengers.map((passenger) => (
                        <SelectItem key={passenger.id} value={passenger.id}>
                          {passenger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chauffeur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un chauffeur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu de départ</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Latitude"
                        value={field.value[0]}
                        onChange={(e) =>
                          field.onChange([
                            parseFloat(e.target.value),
                            field.value[1],
                          ])
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Longitude"
                        value={field.value[1]}
                        onChange={(e) =>
                          field.onChange([
                            field.value[0],
                            parseFloat(e.target.value),
                          ])
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Entrez les coordonnées du lieu de départ
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu d&apos;arrivée</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Latitude"
                        value={field.value[0]}
                        onChange={(e) =>
                          field.onChange([
                            parseFloat(e.target.value),
                            field.value[1],
                          ])
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Longitude"
                        value={field.value[1]}
                        onChange={(e) =>
                          field.onChange([
                            field.value[0],
                            parseFloat(e.target.value),
                          ])
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Entrez les coordonnées du lieu d&apos;arrivée
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de départ</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure d&apos;arrivée</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Laissez vide si la course est en cours
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
                      <SelectItem value="Pending">En attente</SelectItem>
                      <SelectItem value="Ongoing">En cours</SelectItem>
                      <SelectItem value="Completed">Terminée</SelectItem>
                      <SelectItem value="Cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>Entrez le tarif en FCFA</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Card">Carte</SelectItem>
                      <SelectItem value="Cash">Espèces</SelectItem>
                      <SelectItem value="Wallet">Portefeuille</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez une note entre 1 et 5
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
