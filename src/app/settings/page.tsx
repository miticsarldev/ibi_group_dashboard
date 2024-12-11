"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useGlobalParameters } from "@/contexts/GlobalParametersContext";
import { useToast } from "@/hooks/use-toast";
import { GlobalParameters } from "@/types";

export default function SettingsPage() {
  const { parameters, updateParameters } = useGlobalParameters();
  const [settings, setSettings] = useState<GlobalParameters>({
    ...parameters,
    carAmount: parameters.carAmount.toString(),
    motorbikeAmount: parameters.motorbikeAmount.toString(),
    chargingStationRate: parameters.chargingStationRate?.toString() || "1000",
    maintenanceThreshold: parameters.maintenanceThreshold?.toString() || "5000",
    defaultCurrency: parameters.defaultCurrency || "FCFA",
    language: parameters.language || "fr",
    darkMode: parameters.darkMode || false,
    notificationsEnabled: parameters.notificationsEnabled || true,
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericFields = [
      "carAmount",
      "motorbikeAmount",
      "chargingStationRate",
      "maintenanceThreshold",
    ] as const;
    const updatedSettings = { ...settings };

    for (const field of numericFields) {
      const index = numericFields.indexOf(field);
      const value = numericFields[index];

      if (isNaN(+value)) {
        toast({
          title: "Erreur de saisie",
          description: `Veuillez entrer un montant valide pour ${field}.`,
          variant: "destructive",
        });
        return;
      }
      updatedSettings[field] = value;
    }

    updateParameters(updatedSettings);
    toast({
      title: "Paramètres mis à jour",
      description: "Les paramètres ont été mis à jour avec succès.",
    });
    router.push("/");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>
        <form onSubmit={handleSubmit}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de l&apos;application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    name="language"
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSelectChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Mode sombre</Label>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("darkMode", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notificationsEnabled">
                    Activer les notifications
                  </Label>
                  <Switch
                    id="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notificationsEnabled", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Financiers</CardTitle>
                <CardDescription>
                  Définissez les montants et les tarifs pour les véhicules et
                  les services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carAmount">
                    Montant pour les voitures (FCFA)
                  </Label>
                  <Input
                    id="carAmount"
                    name="carAmount"
                    type="text"
                    value={settings.carAmount}
                    onChange={handleInputChange}
                    placeholder="Entrez le montant pour les voitures"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motorbikeAmount">
                    Montant pour les motos (FCFA)
                  </Label>
                  <Input
                    id="motorbikeAmount"
                    name="motorbikeAmount"
                    type="text"
                    value={settings.motorbikeAmount}
                    onChange={handleInputChange}
                    placeholder="Entrez le montant pour les motos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chargingStationRate">
                    Tarif des stations de charge (FCFA/kWh)
                  </Label>
                  <Input
                    id="chargingStationRate"
                    name="chargingStationRate"
                    type="text"
                    value={settings.chargingStationRate}
                    onChange={handleInputChange}
                    placeholder="Entrez le tarif des stations de charge"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                  <Select
                    name="defaultCurrency"
                    value={settings.defaultCurrency}
                    onValueChange={(value) =>
                      handleSelectChange("defaultCurrency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCFA">FCFA</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Maintenance</CardTitle>
                <CardDescription>
                  Configurez les seuils et les intervalles de maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceThreshold">
                    Seuil de maintenance (km)
                  </Label>
                  <Input
                    id="maintenanceThreshold"
                    name="maintenanceThreshold"
                    type="text"
                    value={settings.maintenanceThreshold}
                    onChange={handleInputChange}
                    placeholder="Entrez le seuil de maintenance"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Préférences Utilisateur</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Mode sombre</Label>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("darkMode", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notificationsEnabled">
                    Activer les notifications
                  </Label>
                  <Switch
                    id="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notificationsEnabled", checked)
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    name="language"
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSelectChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Enregistrer tous les paramètres
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
