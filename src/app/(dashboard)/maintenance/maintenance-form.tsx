"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { MaintenanceRecord, Vehicle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Timestamp } from "firebase/firestore";

interface MaintenanceFormProps {
  maintenance?: MaintenanceRecord;
  onSubmit: (maintenanceData: Omit<MaintenanceRecord, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  vehicles: Vehicle[];
  maintenances: MaintenanceRecord[];
}

const formSchema = z.object({
  vehicle: z.string().min(1, { message: "Le véhicule est requis." }),
  date: z.date({ required_error: "La date est requise." }),
  description: z.string().min(1, { message: "La description est requise." }),
  cost: z.number().min(0, { message: "Le coût doit être un nombre positif." }),
  type: z.enum(["Routine", "Repair", "Inspection"]),
});

export function MaintenanceForm({
  maintenance,
  onSubmit,
  onCancel,
  isOpen,
  vehicles,
  maintenances,
}: MaintenanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    maintenance?.date ? maintenance.date.toDate() : new Date()
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle: maintenance?.vehicle || "",
      date: maintenance?.date ? maintenance.date.toDate() : new Date(),
      description: maintenance?.description || "",
      cost: maintenance?.cost || 0,
      type: maintenance?.type || "Routine",
    },
  });

  const getAvailableVehicles = () => {
    if (!selectedDate) return vehicles;
    return vehicles.filter((vehicle) => {
      const existingMaintenance = maintenances.find(
        (m) =>
          m.vehicle === vehicle.id &&
          m.date.toDate().toDateString() === selectedDate.toDateString() &&
          (maintenance ? m.id !== maintenance.id : true)
      );
      return !existingMaintenance;
    });
  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const maintenanceData: Omit<MaintenanceRecord, "id"> = {
        ...values,
        date: Timestamp.fromDate(values.date),
      };
      await onSubmit(maintenanceData);
      toast({
        title: "Succès",
        description: "L'enregistrement de maintenance a été sauvegardé.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement de la maintenance.",
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
            {maintenance
              ? "Modifier la maintenance"
              : "Ajouter une maintenance"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="date"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Controller
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => {
                            field.onChange(date);
                            setSelectedDate(date);
                          }}
                          dateFormat="dd/MM/yyyy"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Sélectionnez la date de la maintenance.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véhicule</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un véhicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getAvailableVehicles().map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} ({vehicle.Vnumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez le véhicule concerné par cette maintenance.
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Décrivez la maintenance effectuée.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coût</FormLabel>
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
                    Entrez le coût de la maintenance en FCFA.
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
                  <FormLabel>Type</FormLabel>
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
                      <SelectItem value="Routine">Routine</SelectItem>
                      <SelectItem value="Repair">Réparation</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez le type de maintenance effectuée.
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
