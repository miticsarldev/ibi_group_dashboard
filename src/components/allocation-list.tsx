import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const allocations = [
  {
    id: 1,
    driver: "John Doe",
    vehicle: "AX454656",
    startDate: "2023-05-01",
    endDate: "2023-05-07",
    type: "Weekly",
  },
  {
    id: 2,
    driver: "Jane Smith",
    vehicle: "BM789012",
    startDate: "2023-05-02",
    endDate: "2023-05-02",
    type: "Daily",
  },
  {
    id: 3,
    driver: "Bob Johnson",
    vehicle: "CY345678",
    startDate: "2023-05-01",
    endDate: "2023-05-31",
    type: "Monthly",
  },
];

export default function AllocationList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Allocations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.driver}</TableCell>
                <TableCell>{allocation.vehicle}</TableCell>
                <TableCell>{allocation.startDate}</TableCell>
                <TableCell>{allocation.endDate}</TableCell>
                <TableCell>{allocation.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
