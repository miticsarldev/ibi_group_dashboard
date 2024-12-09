"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGlobalParameters } from "@/contexts/GlobalParametersContext";
import { useToast } from "@/hooks/use-toast";

export default function ParametersPage() {
  const { parameters, updateParameters } = useGlobalParameters();
  const [carAmount, setCarAmount] = useState(parameters.carAmount.toString());
  const [motorbikeAmount, setMotorbikeAmount] = useState(
    parameters.motorbikeAmount.toString()
  );
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCarAmount = parseInt(carAmount, 10);
    const newMotorbikeAmount = parseInt(motorbikeAmount, 10);

    if (isNaN(newCarAmount) || isNaN(newMotorbikeAmount)) {
      toast({
        title: "Erreur de saisie",
        description: "Veuillez entrer des montants valides.",
        variant: "destructive",
      });
      return;
    }

    updateParameters({
      carAmount: newCarAmount,
      motorbikeAmount: newMotorbikeAmount,
    });
    toast({
      title: "Paramètres mis à jour",
      description: "Les montants globaux ont été mis à jour avec succès.",
    });
    router.push("/revenue");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Paramètres Globaux</CardTitle>
          <CardDescription>
            Définissez les montants globaux pour les voitures et les motos
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carAmount">
                Montant pour les voitures (FCFA)
              </Label>
              <Input
                id="carAmount"
                type="number"
                value={carAmount}
                onChange={(e) => setCarAmount(e.target.value)}
                placeholder="Entrez le montant pour les voitures"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motorbikeAmount">
                Montant pour les motos (FCFA)
              </Label>
              <Input
                id="motorbikeAmount"
                type="number"
                value={motorbikeAmount}
                onChange={(e) => setMotorbikeAmount(e.target.value)}
                placeholder="Entrez le montant pour les motos"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Enregistrer les paramètres
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
