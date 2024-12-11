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

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  availablePlugs: z
    .number()
    .min(0, "Le nombre de prises disponibles doit être positif"),
  totalPlugs: z
    .number()
    .min(1, "Le nombre total de prises doit être au moins 1"),
  pricePerCharge: z.number().min(0, "Le prix par charge doit être positif"),
  operatingHours: z.string().min(1, "Les heures d'ouverture sont requises"),
});

interface ChargingStationFormProps {
  chargingStation?: ChargingStation;
}

export function ChargingStationForm({
  chargingStation,
}: ChargingStationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: chargingStation?.name || "",
      latitude: chargingStation?.location[0] || 0,
      longitude: chargingStation?.location[1] || 0,
      availablePlugs: chargingStation?.availablePlugs || 0,
      totalPlugs: chargingStation?.totalPlugs || 1,
      pricePerCharge: chargingStation?.pricePerCharge || 0,
      operatingHours: chargingStation?.operatingHours || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const submissionValues = {
      ...values,
      location: [values.latitude, values.longitude],
    };

    console.log(submissionValues);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Form submitted successfully");
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la station</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Entrez le nom de la station de charge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="availablePlugs"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Prises disponibles</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalPlugs"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Prises totales</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pricePerCharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par charge (CFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Entrez le prix par charge en CFA.
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
              <FormLabel>Heures d&apos;ouverture</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Entrez les heures d&apos;ouverture de la station (ex:
                &quot;24/7&quot; ou &quot;6:00 - 22:00&quot;).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Sauvegarder"}
        </Button>
      </form>
    </Form>
  );
}
