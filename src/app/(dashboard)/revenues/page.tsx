// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   format,
//   startOfWeek,
//   endOfWeek,
//   endOfMonth,
//   eachDayOfInterval,
//   eachWeekOfInterval,
//   eachMonthOfInterval,
//   startOfMonth,
//   isBefore,
//   subMonths,
//   isWithinInterval,
//   startOfDay,
//   endOfDay,
// } from "date-fns";
// import { fr } from "date-fns/locale";
// import { useGlobalParameters } from "@/contexts/GlobalParametersContext";
// import { Allocation, Vehicle, VehicleType } from "@/types";
// import { formatNumber } from "@/lib/utils";
// import { Timestamp } from "firebase/firestore";
// import { listDocuments } from "@/firebase/firebase.services";

// export default function RevenuePage() {
//   const { parameters } = useGlobalParameters();
//   const [filteredData, setFilteredData] = useState<Allocation[]>([]);
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const today = new Date();
//   const firstDayOfLastMonth = isBefore(today.getDate(), 15)
//     ? startOfMonth(subMonths(today, 1))
//     : startOfMonth(today);

//   const [dateRange, setDateRange] = useState<{
//     from: Date | null;
//     to: Date | null;
//   }>({ from: firstDayOfLastMonth, to: new Date() });
//   const [dateGrouping, setDateGrouping] = useState<"day" | "week" | "month">(
//     "day"
//   );
//   const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");

//   const resetDateRange = () => {
//     setDateRange({ from: null, to: null });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedAllocations = await listDocuments<Allocation>(
//           "allocations"
//         );
//         const fetchedVehicles = await listDocuments<Vehicle>("vehicles");
//         setVehicles(fetchedVehicles);

//         let filtered = fetchedAllocations;

//         if (vehicleType !== "all") {
//           filtered = filtered.filter((item) => {
//             const matchedVehicle = fetchedVehicles.find(
//               (vehicle) => vehicle.id === item.vehicle
//             );
//             if (!matchedVehicle) return false;

//             return vehicleType === matchedVehicle.type;
//           });
//         }

//         if (dateRange.from && dateRange.to) {
//           filtered = filtered.filter((item) => {
//             const itemDate = (item.startDate as Timestamp).toDate();
//             return isWithinInterval(itemDate, {
//               start: dateRange.from!,
//               end: dateRange.to!,
//             });
//           });
//         }

//         setFilteredData(filtered);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [dateRange, vehicleType]);

//   const totalRevenue = filteredData.reduce((sum, item) => {
//     const vehicle = vehicles.find((v) => v.id === item.vehicle);
//     const amount =
//       vehicle?.type === "car"
//         ? Number(parameters.carAmount)
//         : Number(parameters.motorbikeAmount);
//     return sum + (item.isPaid ? amount : 0);
//   }, 0);

//   const pendingRevenue = filteredData.reduce((sum, item) => {
//     const vehicle = vehicles.find((v) => v.id === item.vehicle);
//     const amount =
//       vehicle?.type === "car"
//         ? Number(parameters.carAmount)
//         : Number(parameters.motorbikeAmount);
//     return sum + (item.isPaid ? 0 : amount);
//   }, 0);

//   const getChartData = () => {
//     if (!dateRange.from || !dateRange.to) return [];

//     let intervals;
//     let formatStr;

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
//       default:
//         return [];
//     }

//     return intervals.map((date) => {
//       const start = startOfDay(
//         dateGrouping === "day" ? date : startOfWeek(date, { locale: fr })
//       );
//       const end = endOfDay(
//         dateGrouping === "day"
//           ? date
//           : dateGrouping === "week"
//           ? endOfWeek(date, { locale: fr })
//           : endOfMonth(date)
//       );

//       const periodData = filteredData.filter((item) => {
//         const itemDate = (item.startDate as Timestamp).toDate();
//         return isWithinInterval(itemDate, { start, end });
//       });

//       const { revenue, pending } = periodData.reduce(
//         (acc, item) => {
//           const vehicle = vehicles.find((v) => v.id === item.vehicle);
//           if (!vehicle) return acc;
//           const amount =
//             vehicle.type === "car"
//               ? Number(parameters.carAmount)
//               : Number(parameters.motorbikeAmount);

//           if (item.isPaid) {
//             acc.revenue += amount;
//           } else {
//             acc.pending += amount;
//           }

//           return acc;
//         },
//         { revenue: 0, pending: 0 }
//       );

//       return {
//         date: format(date, formatStr, { locale: fr }),
//         revenue,
//         pending,
//       };
//     });
//   };

//   const chartData = getChartData();

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Suivi des Revenus</h1>
//       <div className="flex justify-between items-center mb-6">
//         <DatePickerWithRange
//           from={dateRange.from!}
//           to={dateRange.to!}
//           onSelect={(range) =>
//             setDateRange({ from: range.from, to: range.to ?? null })
//           }
//           onReset={resetDateRange}
//         />
//         <Select
//           value={dateGrouping}
//           onValueChange={(value: "day" | "week" | "month") =>
//             setDateGrouping(value)
//           }
//         >
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Groupement par" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="day">Jour</SelectItem>
//             <SelectItem value="week">Semaine</SelectItem>
//             <SelectItem value="month">Mois</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select
//           value={vehicleType}
//           onValueChange={(value: "all" | VehicleType) => setVehicleType(value)}
//         >
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Type de véhicule" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Tous</SelectItem>
//             <SelectItem value="car">Voitures</SelectItem>
//             <SelectItem value="motorbike">Motos</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatNumber(totalRevenue)} FCFA
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Revenu en Attente
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatNumber(pendingRevenue)} FCFA
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Taux de Paiement
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {((totalRevenue / (totalRevenue + pendingRevenue)) * 100).toFixed(
//                 2
//               )}
//               %
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="grid gap-6 mb-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Graphique des Revenus</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="revenue" fill="#8884d8" name="Revenu Payé" />
//                 <Bar
//                   dataKey="pending"
//                   fill="#82ca9d"
//                   name="Revenu en Attente"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Détails des Revenus</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Montant</TableHead>
//                 <TableHead>Statut</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredData.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>
//                     {format(
//                       (item.startDate as Timestamp).toDate(),
//                       "dd/MM/yyyy",
//                       {
//                         locale: fr,
//                       }
//                     )}
//                   </TableCell>
//                   <TableCell>{item.type}</TableCell>
//                   <TableCell>
//                     {formatNumber(
//                       vehicles.find((v) => v.id === item.vehicle)?.type ===
//                         "car"
//                         ? Number(parameters.carAmount)
//                         : Number(parameters.motorbikeAmount)
//                     )}{" "}
//                     FCFA
//                   </TableCell>
//                   <TableCell>{item.isPaid ? "Payé" : "En attente"}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
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
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useGlobalParameters } from "@/contexts/GlobalParametersContext";
import { Allocation, Vehicle, VehicleType } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { listDocuments } from "@/firebase/firebase.services";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function RevenuePage() {
  const { parameters } = useGlobalParameters();
  const [filteredData, setFilteredData] = useState<Allocation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const today = new Date();
  const firstDayOfLastMonth = isBefore(today.getDate(), 15)
    ? startOfMonth(subMonths(today, 1))
    : startOfMonth(today);

  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: firstDayOfLastMonth, to: today });
  const [dateGrouping, setDateGrouping] = useState<"day" | "week" | "month">(
    "day"
  );
  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");

  const resetDateRange = () => {
    setDateRange({ from: firstDayOfLastMonth, to: today });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAllocations = await listDocuments<Allocation>(
          "allocations"
        );
        const fetchedVehicles = await listDocuments<Vehicle>("vehicles");
        setVehicles(fetchedVehicles);

        let filtered = fetchedAllocations;

        if (vehicleType !== "all") {
          filtered = filtered.filter((item) => {
            const matchedVehicle = fetchedVehicles.find(
              (vehicle) => vehicle.id === item.vehicle
            );
            if (!matchedVehicle) return false;

            return vehicleType === matchedVehicle.type;
          });
        }

        if (dateRange.from && dateRange.to) {
          filtered = filtered.filter((item) => {
            const itemDate = (item.startDate as Timestamp).toDate();
            return isWithinInterval(itemDate, {
              start: dateRange.from!,
              end: dateRange.to!,
            });
          });
        }

        setFilteredData(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dateRange, vehicleType]);

  const totalRevenue = filteredData.reduce((sum, item) => {
    const vehicle = vehicles.find((v) => v.id === item.vehicle);
    const amount =
      vehicle?.type === "car"
        ? Number(parameters.carAmount)
        : Number(parameters.motorbikeAmount);
    return sum + (item.isPaid ? amount : 0);
  }, 0);

  const pendingRevenue = filteredData.reduce((sum, item) => {
    const vehicle = vehicles.find((v) => v.id === item.vehicle);
    const amount =
      vehicle?.type === "car"
        ? Number(parameters.carAmount)
        : Number(parameters.motorbikeAmount);
    return sum + (item.isPaid ? 0 : amount);
  }, 0);

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

      const periodData = filteredData.filter((item) => {
        const itemDate = (item.startDate as Timestamp).toDate();
        return isWithinInterval(itemDate, { start, end });
      });

      const { revenue, pending } = periodData.reduce(
        (acc, item) => {
          const vehicle = vehicles.find((v) => v.id === item.vehicle);
          if (!vehicle) return acc;
          const amount =
            vehicle.type === "car"
              ? Number(parameters.carAmount)
              : Number(parameters.motorbikeAmount);

          if (item.isPaid) {
            acc.revenue += amount;
          } else {
            acc.pending += amount;
          }

          return acc;
        },
        { revenue: 0, pending: 0 }
      );

      return {
        date: format(date, formatStr, { locale: fr }),
        revenue,
        pending,
        total: revenue + pending,
      };
    });
  };

  const chartData = getChartData();

  const donutChartData = [
    { name: "Revenu Payé", value: totalRevenue },
    { name: "Revenu en Attente", value: pendingRevenue },
  ];

  const vehicleTypeData = vehicles.reduce((acc, vehicle) => {
    const type = vehicle.type;
    const existingType = acc.find((item) => item.name === type);
    if (existingType) {
      existingType.value++;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Suivi des Revenus</h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <DatePickerWithRange
          from={dateRange.from || undefined}
          to={dateRange.to || undefined}
          onSelect={(range) =>
            setDateRange({ from: range.from, to: range.to || null })
          }
          onReset={resetDateRange}
        />
        <div className="flex space-x-2">
          <Select
            value={dateGrouping}
            onValueChange={(value: "day" | "week" | "month") =>
              setDateGrouping(value)
            }
          >
            <SelectTrigger className="w-[140px]">
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
            onValueChange={(value: "all" | VehicleType) =>
              setVehicleType(value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type de véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="car">Voitures</SelectItem>
              <SelectItem value="bike">Motos</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenu Payé"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#82ca9d"
                  name="Revenu en Attente"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donutChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {donutChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comparaison des Revenus</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Types de Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={20}
                data={vehicleTypeData}
              >
                <RadialBar
                  label={{ position: "insideStart", fill: "#fff" }}
                  background
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
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
                    {format(
                      (item.startDate as Timestamp).toDate(),
                      "dd/MM/yyyy",
                      {
                        locale: fr,
                      }
                    )}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {formatNumber(
                      vehicles.find((v) => v.id === item.vehicle)?.type ===
                        "car"
                        ? Number(parameters.carAmount)
                        : Number(parameters.motorbikeAmount)
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
