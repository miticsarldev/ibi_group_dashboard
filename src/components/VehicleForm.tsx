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
import { Vehicle } from "@/types";

const formSchema = z.object({
  plate: z.string().min(2, {
    message: "La plaque d'immatriculation doit contenir au moins 2 caractères.",
  }),
  type: z.enum(["car", "bike"]),
  status: z.enum(["En service", "En maintenance", "Disponible"], {
    message: "Le statut doit contenir au moins 2 caractères.",
  }),
  Vnumber: z.string().optional(),
});

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Vnumber: vehicle?.Vnumber || "",
      plate: vehicle?.plate || "",
      type: vehicle?.type || "car",
      status: vehicle?.status || "En service",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Here you would typically send the data to your backend
    console.log(values);
    setTimeout(() => {
      setIsSubmitting(false);
      // Here you would typically handle the response from your backend
      console.log("Form submitted successfully");
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Entrez le numéro de véhicule s&apos;il existe.
              </FormDescription>
              <FormMessage />
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de véhicule</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormDescription>Choisissez le type de véhicule.</FormDescription>
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Sauvegarder"}
        </Button>
      </form>
    </Form>
  );
}
