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
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/hooks/useFirebase";

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Omit<User, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  role: z.enum(["admin", "dispatcher", "driver", "taxi_driver"] as const),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

export function UserForm({ user, onSubmit, onCancel, isOpen }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useFirebase();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "driver",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (user) {
        // Update existing user
        const userData: Omit<User, "id"> = {
          ...user,
          name: values.name,
          email: values.email,
          role: values.role,
          updatedAt: Timestamp.now(),
        };
        await onSubmit(userData);
      } else {
        // Create new user
        const userId = await signUp(values.email, values.password, {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: true,
        });

        if (userId) {
          toast({
            title: "Succès",
            description:
              "L'utilisateur a été créé et peut maintenant s'authentifier.",
          });
        }
      }
      onCancel(); // Add this line to close the form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement de l'utilisateur.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
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
                    Entrez le nom complet de l&apos;utilisateur.
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
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormDescription>
                    Entrez l&apos;adresse email de l&apos;utilisateur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="dispatcher">Répartiteur</SelectItem>
                      <SelectItem value="driver">Chauffeur</SelectItem>
                      <SelectItem value="taxi_driver">
                        Chauffeur de Taxi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez le rôle de l&apos;utilisateur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    {user
                      ? "Entrez un nouveau mot de passe pour modifier celui existant."
                      : "Entrez un mot de passe pour le nouvel utilisateur."}
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
