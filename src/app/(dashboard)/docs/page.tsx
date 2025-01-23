import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DocumentationTableauDeBord: React.FC = () => {
  return (
    <div className="p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-800">
            Documentation du Tableau de Bord de Gestion de Flotte
          </h1>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vue-densemble">
            <TabsList className="mb-4">
              <TabsTrigger value="vue-densemble">
                Vue d&apos;ensemble
              </TabsTrigger>
              <TabsTrigger value="gestion-des-vehicules">
                Gestion des Véhicules
              </TabsTrigger>
              <TabsTrigger value="gestion-des-conducteurs">
                Gestion des Conducteurs
              </TabsTrigger>
              <TabsTrigger value="attributions">Attributions</TabsTrigger>
              <TabsTrigger value="entretien">Entretien</TabsTrigger>
              <TabsTrigger value="stations-de-recharge">
                Stations de Recharge
              </TabsTrigger>
              <TabsTrigger value="suivi-des-revenus">
                Suivi des Revenus
              </TabsTrigger>
              <TabsTrigger value="parametres">Paramètres</TabsTrigger>
              <TabsTrigger value="depannage">Dépannage</TabsTrigger>
            </TabsList>

            <TabsContent value="vue-densemble">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Vue d&apos;ensemble</h2>
                <p className="text-gray-600">
                  Le tableau de bord de gestion de flotte fournit une plateforme
                  centralisée pour gérer votre flotte de véhicules, vos
                  conducteurs et les opérations associées.
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Suivi des véhicules en temps réel</li>
                  <li>Analyse des performances des conducteurs</li>
                  <li>Planification de l&apos;entretien</li>
                  <li>Gestion des revenus et finances</li>
                  <li>Gestion des stations de recharge</li>
                </ul>
              </section>
            </TabsContent>

            <TabsContent value="gestion-des-vehicules">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Gestion des Véhicules</h2>
                <p className="text-gray-600">
                  Gérez tous les véhicules de votre flotte, y compris
                  l&apos;ajout, la mise à jour et la recherche de véhicules.
                </p>
                <h3 className="text-lg font-medium">
                  Ajouter un Nouveau Véhicule
                </h3>
                <ul className="list-decimal pl-5 text-gray-600">
                  <li>Cliquez sur le bouton &#34;Ajouter un Véhicule&#34;.</li>
                  <li>
                    Remplissez les informations requises (Type de Véhicule,
                    Plaque d&apos;Immatriculation, VIN, etc.).
                  </li>
                  <li>
                    Cliquez sur &#34;Enregistrer&#34; pour ajouter le véhicule à
                    votre flotte.
                  </li>
                </ul>
              </section>
            </TabsContent>

            <TabsContent value="gestion-des-conducteurs">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Gestion des Conducteurs
                </h2>
                <p className="text-gray-600">
                  Gérez les détails des conducteurs, y compris l&apos;ajout de
                  nouveaux conducteurs, la mise à jour de leurs informations et
                  la consultation de leurs performances.
                </p>
              </section>
            </TabsContent>

            <TabsContent value="attributions">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Attributions</h2>
                <p className="text-gray-600">
                  Assignez des véhicules aux conducteurs et gérez efficacement
                  les attributions en cours.
                </p>
                <h3 className="text-lg font-medium">
                  Créer une Nouvelle Attribution
                </h3>
                <ul className="list-decimal pl-5 text-gray-600">
                  <li>Accédez à l&apos;onglet &#34;Attributions&#34;.</li>
                  <li>
                    Cliquez sur &#34;Nouvelle Attribution&#34; et sélectionnez
                    un véhicule et un conducteur.
                  </li>
                  <li>
                    Définissez les dates de début et de fin de
                    l&apos;attribution.
                  </li>
                  <li>
                    Cliquez sur &#34;Créer une Attribution&#34; pour finaliser.
                  </li>
                </ul>
              </section>
            </TabsContent>

            <TabsContent value="entretien">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Entretien</h2>
                <p className="text-gray-600">
                  Planifiez et suivez les tâches d&apos;entretien pour votre
                  flotte.
                </p>
              </section>
            </TabsContent>

            <TabsContent value="stations-de-recharge">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Stations de Recharge</h2>
                <p className="text-gray-600">
                  Gérez les stations de recharge de votre flotte et assignez des
                  véhicules pour la recharge.
                </p>
              </section>
            </TabsContent>

            <TabsContent value="suivi-des-revenus">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Suivi des Revenus</h2>
                <p className="text-gray-600">
                  Consultez et analysez les données de revenus pour votre
                  flotte.
                </p>
              </section>
            </TabsContent>

            <TabsContent value="parametres">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Paramètres</h2>
                <p className="text-gray-600">
                  Mettez à jour les préférences générales, financières et
                  d&apos;entretien pour votre flotte.
                </p>
              </section>
            </TabsContent>

            <TabsContent value="depannage">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Dépannage</h2>
                <p className="text-gray-600">
                  Si vous rencontrez des problèmes, essayez les étapes suivantes
                  :
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    Rafraîchissez la page pour charger les dernières données.
                  </li>
                  <li>Effacez le cache et les cookies de votre navigateur.</li>
                  <li>Assurez-vous d&apos;une connexion Internet stable.</li>
                  <li>
                    Vérifiez vos autorisations pour l&apos;action en question.
                  </li>
                </ul>
              </section>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-gray-500 text-sm">
            Pour une aide supplémentaire, contactez notre équipe de support à
            l&apos;adresse{" "}
            <a href="mailto:support@miticsarl.com" className="text-blue-500">
              support@miticsarl.com
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentationTableauDeBord;
