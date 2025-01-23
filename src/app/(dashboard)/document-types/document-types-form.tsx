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
import { DocumentType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface DocumentTypeFormProps {
  documentType?: DocumentType;
  onSubmit: (documentTypeData: Omit<DocumentType, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export function DocumentTypeForm({
  documentType,
  onSubmit,
  onCancel,
  isOpen,
}: DocumentTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: documentType?.name || "",
      description: documentType?.description || "",
      isActive: documentType?.isActive || true,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: values.name,
        description: values.description || "",
        isActive: values.isActive,
      });
      toast({
        title: "Succès",
        description: "Le type de document a été enregistré.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement du type de document.",
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
            {documentType
              ? "Modifier le type de document"
              : "Ajouter un type de document"}
          </DialogTitle>
          {documentType ? (
            <DialogDescription>
              Modifiez les détails du type de document ici. Cliquez sur
              sauvegarder une fois terminé.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Entrez les détails du type de document ici. Cliquez sur
              sauvegarder une fois terminé.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 p-1"
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
                    Entrez le nom du type de document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez une description pour ce type de document (optionnel).
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
                    <FormLabel>Actif</FormLabel>
                    <FormDescription>
                      Cochez cette case si ce type de document est actuellement
                      actif.
                    </FormDescription>
                  </div>
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
