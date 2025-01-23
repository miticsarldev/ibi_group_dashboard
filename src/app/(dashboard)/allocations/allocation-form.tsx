"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Allocation, Driver, Vehicle, MaintenanceRecord } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Timestamp } from "firebase/firestore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";
import { listDocuments } from "@/firebase/firebase.services";

interface AllocationFormProps {
  allocation?: Allocation;
  onSubmit: (allocationData: Omit<Allocation, "id">) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  driver: z.string().min(1, { message: "Le chauffeur est requis." }),
  vehicle: z.string().min(1, { message: "Le véhicule est requis." }),
  isPaid: z.boolean(),
  startDate: z.date({
    required_error: "La date et l'heure de début sont requises.",
  }),
  endDate: z.date({
    required_error: "La date et l'heure de fin sont requises.",
  }),
  type: z.enum(["Mission", "Transport"] as const),
  status: z.enum(["Active", "Completed", "Scheduled", "Cancelled"] as const),
  notes: z.string().optional(),
});

export function AllocationForm({
  allocation,
  onSubmit,
  onCancel,
  isOpen,
}: AllocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [openDriver, setOpenDriver] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driver: allocation?.driver || "",
      vehicle: allocation?.vehicle || "",
      isPaid: allocation?.isPaid || false,
      startDate: allocation?.startDate
        ? allocation.startDate.toDate()
        : new Date(),
      endDate: allocation?.endDate ? allocation.endDate.toDate() : new Date(),
      type: allocation?.type || "Mission",
      status: allocation?.status || "Scheduled",
      notes: allocation?.notes || "",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const [
        fetchedDrivers,
        fetchedVehicles,
        fetchedAllocations,
        fetchedMaintenances,
      ] = await Promise.all([
        listDocuments<Driver>("drivers"),
        listDocuments<Vehicle>("vehicles"),
        listDocuments<Allocation>("allocations"),
        listDocuments<MaintenanceRecord>("maintenances"),
      ]);

      setDrivers(fetchedDrivers);
      setVehicles(fetchedVehicles);
      setAllocations(fetchedAllocations);
      setMaintenances(fetchedMaintenances);
    } catch (error) {
      console.error("Error fetching data:", error);

      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isDriverAvailable = (driverId: string) => {
    return !allocations.some(
      (a) =>
        a.driver === driverId &&
        a.status !== "Completed" &&
        a.status !== "Cancelled" &&
        (allocation ? a.id !== allocation.id : true)
    );
  };

  const isVehicleAvailable = (vehicleId: string) => {
    const currentDate = new Date();
    return (
      !allocations.some(
        (a) =>
          a.vehicle === vehicleId &&
          a.status !== "Completed" &&
          a.status !== "Cancelled" &&
          (allocation ? a.id !== allocation.id : true)
      ) &&
      !maintenances.some(
        (m) =>
          m.vehicle === vehicleId &&
          m.date.toDate() <= currentDate &&
          (m.type === "Repair" || m.type === "Inspection")
      )
    );
  };

  const availableDrivers = drivers.filter((driver) =>
    isDriverAvailable(driver.id)
  );
  const availableVehicles = vehicles.filter((vehicle) =>
    isVehicleAvailable(vehicle.id)
  );

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const allocationData: Omit<Allocation, "id"> = {
        ...values,
        startDate: Timestamp.fromDate(values.startDate),
        endDate: Timestamp.fromDate(values.endDate),
      };
      await onSubmit(allocationData);
      toast({
        title: "Succès",
        description: "L'allocation a été enregistrée.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement de l'allocation.",
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
            {allocation ? "Modifier l'allocation" : "Ajouter une allocation"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 p-1 max-h-[70vh] overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="driver"
              render={({ field }) => {
                const selectedDriver = availableDrivers.find(
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
                          <CommandEmpty>
                            Aucun conducteur disponible.
                          </CommandEmpty>
                          <CommandList>
                            {availableDrivers.map((driver) => (
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
                      Choisissez le conducteur disponible pour cette allocation.
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
                const selectedVehicle = availableVehicles.find(
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
                          <CommandEmpty>
                            Aucun véhicule disponible.
                          </CommandEmpty>
                          <CommandList>
                            {availableVehicles.map((vehicle) => (
                              <CommandItem
                                key={vehicle.id}
                                value={
                                  vehicle?.plate.toString() +
                                  " - " +
                                  vehicle?.Vnumber
                                }
                                onSelect={() => {
                                  form.setValue(
                                    "vehicle",
                                    vehicle.id.toString()
                                  );
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
                      Choisissez le véhicule disponible pour cette allocation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                      Cochez cette case si l&#39;allocation a été payée.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date et heure de début</FormLabel>
                  <FormControl>
                    <Controller
                      name="startDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date et heure de fin</FormLabel>
                  <FormControl>
                    <Controller
                      name="endDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      )}
                    />
                  </FormControl>
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
                      <SelectItem value="Mission">Mission</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Terminée</SelectItem>
                      <SelectItem value="Scheduled">Planifiée</SelectItem>
                      <SelectItem value="Cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
