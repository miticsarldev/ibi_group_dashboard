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
import { MaintenanceRecord, Vehicle } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);
setDefaultLocale("fr");

const formSchema = z.object({
  vehicle: z.string(),
  date: z.date(),
  type: z.string(),
  description: z.string().min(1, "La description est requise"),
  cost: z.number().min(0, "Le coût doit être positif"),
});

interface MaintenanceFormProps {
  maintenanceRecord?: MaintenanceRecord;
  vehicles: Vehicle[];
}

export function MaintenanceForm({
  maintenanceRecord,
  vehicles = [],
}: MaintenanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle: maintenanceRecord?.vehicle?.toString() || "",
      date: maintenanceRecord?.date
        ? new Date(maintenanceRecord.date)
        : new Date(),
      type: maintenanceRecord?.type || "Routine",
      description: maintenanceRecord?.description || "",
      cost: maintenanceRecord?.cost || 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const submissionValues = {
      ...values,
      vehicle: parseInt(values.vehicle, 10),
      date: values.date.toISOString(),
    };

    console.log(submissionValues);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Form submitted successfully");
    }, 1000);
  }

  return (
    <Form {...form}>
      <div className="max-h-[70vh] overflow-y-scroll pr-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => {
              const selectedVehicle = vehicles?.find(
                (vehicle) => vehicle?.id?.toString() === field.value
              );

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Véhicule</FormLabel>
                  <Popover open={openVehicle} onOpenChange={setOpenVehicle}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openVehicle}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? `${selectedVehicle?.plate} - ${selectedVehicle?.Vnumber}`
                            : "Sélectionnez un véhicule"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un véhicule..." />
                        <CommandEmpty>Aucun véhicule trouvé.</CommandEmpty>
                        <CommandList>
                          {vehicles?.map((vehicle) => (
                            <CommandItem
                              key={vehicle.id}
                              value={
                                vehicle?.plate.toString() +
                                " - " +
                                vehicle?.Vnumber
                              }
                              onSelect={() => {
                                form.setValue("vehicle", vehicle.id.toString());
                                setOpenVehicle(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === vehicle.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {vehicle.plate} - {vehicle.Vnumber}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Choisissez le véhicule pour cet enregistrement de
                    maintenance.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    locale="fr"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="JJ/MM/AAAA"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  Choisissez le type de maintenance.
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
                  Décrivez brièvement la maintenance effectuée.
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
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Entrez le coût de la maintenance en CFA.
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
