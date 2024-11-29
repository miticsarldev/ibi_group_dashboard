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
import { Driver } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  licenseNumber: z.string().min(5, {
    message: "Le numéro de licence doit contenir au moins 5 caractères.",
  }),
  status: z.enum(["Active", "Inactive", "Suspension"]),
  experienceYears: z.number().min(0, {
    message: "Les années d'expérience ne peuvent pas être négatives.",
  }),
  rating: z.number().min(0).max(5).optional(),
});

export function DriverForm({ driver }: { driver?: Driver }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: driver?.name || "",
      email: driver?.email || "",
      phone: driver?.phone || "",
      address: driver?.address || "",
      licenseNumber: driver?.licenseNumber || "",
      status: driver?.status || "Active",
      experienceYears: driver?.experienceYears || 0,
      rating: driver?.rating || undefined,
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
      <div className="max-h-[70vh] overflow-y-scroll pr-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Entrez le nom complet du conducteur.
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
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Entrez l&apos;adresse email du conducteur.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="+22370012345" {...field} />
                </FormControl>
                <FormDescription>
                  Entrez le numéro de téléphone du conducteur.
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
                  <Input placeholder="123 Rue Principale, Bamako" {...field} />
                </FormControl>
                <FormDescription>
                  Entrez l&apos;adresse du conducteur.
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
                <FormLabel>Numéro de Licence</FormLabel>
                <FormControl>
                  <Input placeholder="ML-2345-6789" {...field} />
                </FormControl>
                <FormDescription>
                  Entrez le numéro de licence du conducteur.
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
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez le statut actuel du conducteur.
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
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Entrez le nombre d&apos;années d&apos;expérience du
                  conducteur.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Entrez la note du conducteur (de 0 à 5).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Sauvegarder"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
