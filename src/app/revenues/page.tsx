"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfMonth,
  isBefore,
  subMonths,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useGlobalParameters } from "@/contexts/GlobalParametersContext";
import { Allocation, VehicleType } from "@/types";
import { allocations, vehicles } from "@/utils/data";
import { formatNumber } from "@/lib/utils";

export default function RevenuePage() {
  const { parameters } = useGlobalParameters();
  const [filteredData, setFilteredData] = useState<Allocation[]>(allocations);
  const today = new Date();
  const firstDayOfLastMonth = isBefore(today.getDate(), 15)
    ? startOfMonth(subMonths(today, 1))
    : startOfMonth(today);

  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: firstDayOfLastMonth, to: new Date() });
  const [dateGrouping, setDateGrouping] = useState<"day" | "week" | "month">(
    "day"
  );
  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");

  useEffect(() => {
    // let filtered = allocations;

    // if (vehicleType !== "all") {
    //   filtered = filtered.filter((item) => {
    //     const matchedVehicleType = vehicles.find(
    //       (vehicle) => vehicle.id === item.vehicle
    //     )?.type;
    //     const amount =
    //       matchedVehicleType === "car"
    //         ? parameters.carAmount
    //         : parameters.motorbikeAmount;
    //     return vehicleType === "car"
    //       ? amount === parameters.carAmount
    //       : amount === parameters.motorbikeAmount;
    //   });
    // }

    let filtered = allocations;

    if (vehicleType !== "all") {
      filtered = filtered.filter((item) => {
        const matchedVehicle = vehicles.find(
          (vehicle) => vehicle.id === item.vehicle
        );
        if (!matchedVehicle) return false; // Ensure the vehicle exists

        const amount =
          matchedVehicle.type === "car"
            ? parameters.carAmount
            : parameters.motorbikeAmount;

        return vehicleType === "car"
          ? amount === parameters.carAmount
          : amount === parameters.motorbikeAmount;
      });
    }

    setFilteredData(filtered);
  }, [dateRange, vehicleType, parameters]);

  const totalRevenue = filteredData.reduce(
    (sum, item) =>
      sum +
      (item.isPaid
        ? vehicles.find((vehicle) => vehicle.id === item.vehicle)?.type ===
          "car"
          ? parameters.carAmount
          : parameters.motorbikeAmount
        : 0),
    0
  );

  const pendingRevenue = filteredData.reduce(
    (sum, item) =>
      sum +
      (item.isPaid
        ? 0
        : vehicles.find((vehicle) => vehicle.id === item.vehicle)?.type ===
          "car"
        ? parameters.carAmount
        : parameters.motorbikeAmount),
    0
  );

  //   const getChartData = () => {
  //     if (!dateRange.from || !dateRange.to) return [];

  //     let intervals: Date[];
  //     let formatStr: string;

  //     switch (dateGrouping) {
  //       case "day":
  //         intervals = eachDayOfInterval({
  //           start: dateRange.from,
  //           end: dateRange.to,
  //         });
  //         formatStr = "dd/MM";
  //         break;
  //       case "week":
  //         intervals = eachWeekOfInterval(
  //           { start: dateRange.from, end: dateRange.to },
  //           { locale: fr }
  //         );
  //         formatStr = "'Sem' w";
  //         break;
  //       case "month":
  //         intervals = eachMonthOfInterval({
  //           start: dateRange.from,
  //           end: dateRange.to,
  //         });
  //         formatStr = "MMM yyyy";
  //         break;
  //     }

  //     console.log({ intervals });

  //     return intervals.map((date) => {
  //       const start =
  //         dateGrouping === "day" ? date : startOfWeek(date, { locale: fr });
  //       const end =
  //         dateGrouping === "day"
  //           ? date
  //           : dateGrouping === "week"
  //           ? endOfWeek(date, { locale: fr })
  //           : endOfMonth(date);

  //       const periodData = filteredData.filter((item) => {
  //         const itemDate = new Date(item.startDate);
  //         return itemDate >= start && itemDate <= end;
  //       });

  //       console.log({ periodData });

  //       const revenue = periodData.reduce((sum, item) => {
  //         console.log("Revenue item:", item);
  //         const vehicleType = vehicles.find(
  //           (vehicle) => vehicle.id === item.vehicle
  //         )?.type;
  //         const amount =
  //           vehicleType === "car"
  //             ? parameters.carAmount
  //             : parameters.motorbikeAmount;
  //         return sum + (item.isPaid ? amount : 0);
  //       }, 0);

  //       const pending = periodData.reduce((sum, item) => {
  //         console.log("Pending item:", item);
  //         const vehicleType = vehicles.find(
  //           (vehicle) => vehicle.id === item.vehicle
  //         )?.type;
  //         const amount =
  //           vehicleType === "car"
  //             ? parameters.carAmount
  //             : parameters.motorbikeAmount;
  //         return sum + (item.isPaid ? 0 : amount);
  //       }, 0);

  //       return {
  //         date: format(date, formatStr, { locale: fr }),
  //         revenue,
  //         pending,
  //       };
  //     });
  //   };

  const getChartData = () => {
    if (!dateRange.from || !dateRange.to) return [];

    let intervals;
    let formatStr;

    switch (dateGrouping) {
      case "day":
        intervals = eachDayOfInterval({
          start: dateRange.from,
          end: dateRange.to,
        });
        formatStr = "dd/MM";
        break;
      case "week":
        intervals = eachWeekOfInterval(
          { start: dateRange.from, end: dateRange.to },
          { locale: fr }
        );
        formatStr = "'Sem' w";
        break;
      case "month":
        intervals = eachMonthOfInterval({
          start: dateRange.from,
          end: dateRange.to,
        });
        formatStr = "MMM yyyy";
        break;
      default:
        return [];
    }

    return intervals.map((date) => {
      const start = startOfDay(
        dateGrouping === "day" ? date : startOfWeek(date, { locale: fr })
      );
      const end = endOfDay(
        dateGrouping === "day"
          ? date
          : dateGrouping === "week"
          ? endOfWeek(date, { locale: fr })
          : endOfMonth(date)
      );

      console.log("Interval Start (UTC):", start.toISOString());
      console.log("Interval End (UTC):", end.toISOString());

      const periodData = filteredData.filter((item) => {
        const itemDate = parseISO(item.startDate);
        const isInInterval = isWithinInterval(itemDate, { start, end });
        console.log(
          `Is ${itemDate.toISOString()} within interval?`,
          isInInterval
        );
        return isInInterval;
      });

      console.log("Period data:", periodData);

      const { revenue, pending } = periodData.reduce(
        (acc, item) => {
          const vehicle = vehicles.find((v) => v.id === item.vehicle);
          if (!vehicle) {
            console.error(`Vehicle not found for item:`, item);
            return acc;
          }
          const amount =
            vehicle.type === "car"
              ? parameters.carAmount
              : parameters.motorbikeAmount;

          if (item.isPaid) {
            acc.revenue += amount;
          } else {
            acc.pending += amount;
          }

          console.log("Item calculation:", {
            itemId: item.id,
            vehicleType: vehicle.type,
            amount,
            isPaid: item.isPaid,
            revenueAdded: item.isPaid ? amount : 0,
            pendingAdded: item.isPaid ? 0 : amount,
          });

          return acc;
        },
        { revenue: 0, pending: 0 }
      );

      console.log("Interval totals:", {
        date: format(date, formatStr, { locale: fr }),
        revenue,
        pending,
      });

      return {
        date: format(date, formatStr, { locale: fr }),
        revenue,
        pending,
      };
    });
  };

  const chartData = getChartData();

  console.log({ chartData });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Suivi des Revenus</h1>
      <div className="flex justify-between items-center mb-6">
        <DatePickerWithRange
          from={dateRange.from!}
          to={dateRange.to!}
          onSelect={(range) => setDateRange(range)}
        />
        <Select
          value={dateGrouping}
          onValueChange={(value: "day" | "week" | "month") =>
            setDateGrouping(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Groupement par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Jour</SelectItem>
            <SelectItem value="week">Semaine</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={vehicleType}
          onValueChange={(value: "all" | VehicleType) => setVehicleType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de véhicule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="car">Voitures</SelectItem>
            <SelectItem value="motorbike">Motos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalRevenue)} FCFA
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenu en Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(pendingRevenue)} FCFA
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalRevenue / (totalRevenue + pendingRevenue)) * 100).toFixed(
                2
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Graphique des Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenu Payé" />
                <Bar
                  dataKey="pending"
                  fill="#82ca9d"
                  name="Revenu en Attente"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails des Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.startDate), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {formatNumber(
                      vehicles.find((v) => v.id === item.vehicle)?.type ===
                        "car"
                        ? parameters.carAmount
                        : parameters.motorbikeAmount
                    )}{" "}
                    FCFA
                  </TableCell>
                  <TableCell>{item.isPaid ? "Payé" : "En attente"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
