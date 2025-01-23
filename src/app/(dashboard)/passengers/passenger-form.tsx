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
import { Passenger } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase.init";

interface PassengerFormProps {
  passenger?: Passenger;
  onSubmit: (passengerData: Omit<Passenger, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  phone: z.string().min(10, {
    message: "Le numéro de téléphone doit contenir au moins 10 chiffres.",
  }),
  address: z.string().optional(),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  walletBalance: z.number().min(0),
});

export function PassengerForm({
  passenger,
  onSubmit,
  onCancel,
  isOpen,
}: PassengerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: passenger?.name || "",
      email: passenger?.email || "",
      phone: passenger?.phone || "",
      address: passenger?.address || "",
      password: "",
      walletBalance: passenger?.walletBalance || 0,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let authUser;
      if (!passenger) {
        // Create new user in Firebase Authentication
        authUser = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      }

      const passengerData: Passenger = {
        id: "",
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        profilePicture: passenger?.profilePicture || "",
        walletBalance: values.walletBalance,
        joinedDate: passenger?.joinedDate || Timestamp.now(),
        rideHistory: passenger?.rideHistory || [],
      };

      if (authUser) {
        passengerData.id = authUser.user.uid;
      }

      await onSubmit(passengerData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {passenger ? "Modifier le passager" : "Ajouter un passager"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
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
                    <Input type="email" {...field} />
                  </FormControl>
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
                    <Input {...field} />
                  </FormControl>
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optionnel</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!passenger && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="walletBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solde du portefeuille</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
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
