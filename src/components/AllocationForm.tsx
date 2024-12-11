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
import { Checkbox } from "@/components/ui/checkbox";
import { Allocation, Driver, Vehicle } from "@/types";
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
  driver: z.string(),
  vehicle: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string(),
  type: z.string(),
  isPaid: z.boolean(),
  notes: z.string().optional(),
});

interface AllocationFormProps {
  allocation?: Allocation;
  drivers: Driver[];
  vehicles: Vehicle[];
}

export function AllocationForm({
  allocation,
  drivers = [],
  vehicles = [],
}: AllocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDriver, setOpenDriver] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driver: allocation?.driver?.toString() || "",
      vehicle: allocation?.vehicle?.toString() || "",
      startDate: allocation?.startDate
        ? new Date(allocation.startDate)
        : new Date(),
      endDate: allocation?.endDate ? new Date(allocation.endDate) : new Date(),
      status: allocation?.status || "Active",
      type: allocation?.type || "Transport",
      notes: allocation?.notes || "",
      isPaid: allocation?.isPaid || false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const startDateTime = new Date(values.startDate);
    const endDateTime = new Date(values.endDate);

    const submissionValues = {
      ...values,
      driver: parseInt(values.driver, 10),
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-1">
          <FormField
            control={form.control}
            name="driver"
            render={({ field }) => {
              const selectedDriver = drivers?.find(
                (driver) => driver.id.toString() === field.value
              );

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Conducteur</FormLabel>
                  <Popover open={openDriver} onOpenChange={setOpenDriver}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDriver}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? `${selectedDriver?.name} - ${selectedDriver?.phone}`
                            : "Sélectionnez un conducteur"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un conducteur..." />
                        <CommandEmpty>Aucun conducteur trouvé.</CommandEmpty>
                        <CommandList>
                          {drivers?.map((driver) => (
                            <CommandItem
                              key={driver.id}
                              value={
                                driver.name.toString() +
                                " - " +
                                driver.phone.toString()
                              }
                              onSelect={() => {
                                form.setValue("driver", driver.id.toString());
                                setOpenDriver(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === driver.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {driver.name} - {driver.phone}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Choisissez le conducteur pour cette allocation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

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
                    Choisissez le véhicule pour cette allocation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    locale="fr"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                    placeholderText="JJ/MM/AAAA"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormDescription>
                  Sélectionnez la date de début de l&apos;allocation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    locale="fr"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                    placeholderText="JJ/MM/AAAA"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormDescription>
                  Sélectionnez la date de fin de l&apos;allocation.
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
                    <SelectItem value="Active">En cours</SelectItem>
                    <SelectItem value="Completed">Terminé</SelectItem>
                    <SelectItem value="Scheduled">Planifiée</SelectItem>
                    <SelectItem value="Cancelled">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez le statut actuel de l&apos;allocation.
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
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Mission">Mission</SelectItem>
                    <SelectItem value="Livraison">Livraison</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez le type d&apos;allocation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Payé</FormLabel>
                  <FormDescription>
                    Cochez si l&apos;allocation a été payée.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Ajoutez des notes supplémentaires si nécessaire.
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
