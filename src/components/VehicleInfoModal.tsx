import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Driver, Vehicle } from "@/types";
import {
  Info,
  Car,
  Bike,
  Battery,
  MapPin,
  User,
  Phone,
  Star,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface VehicleInfoModalProps {
  driver: Driver | null;
  vehicle: Vehicle | null;
}

const VehicleInfoModal: React.FC<VehicleInfoModalProps> = ({
  driver,
  vehicle,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Informations Détaillées
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {vehicle && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {vehicle.type === "car" ? (
                    <Car className="h-5 w-5" />
                  ) : (
                    <Bike className="h-5 w-5" />
                  )}
                  Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Plaque:</span>
                  <Badge variant="outline">{vehicle.plate}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Type:</span>
                  <span>{vehicle.type === "car" ? "Voiture" : "Moto"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Statut:</span>
                  <Badge
                    variant={
                      vehicle.status === "En service" ? "default" : "secondary"
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </div>
                {vehicle.isElectric && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        Batterie:
                      </span>
                      <Progress
                        value={vehicle.batteryLevel}
                        className="w-[60%]"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Autonomie:
                      </span>
                      <span>{vehicle.estimatedRange} km</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          {driver && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Conducteur
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Nom:</span>
                  <span>{driver.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone:
                  </span>
                  <span>{driver.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Statut:
                  </span>
                  <Badge
                    variant={
                      driver.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {driver.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Note:
                  </span>
                  <span>{driver?.rating?.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleInfoModal;
