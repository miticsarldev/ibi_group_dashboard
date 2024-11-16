"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BikeIcon, CarIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier && password) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2 text-ibi-color-1">
            <span className="text-4xl font-bold">IBI Group</span>
            <CarIcon size={40} /> <BikeIcon size={40} />
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <h1 className="text-2xl font-bold">
                Connectez-vous à votre compte
              </h1>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="identifier">
                    Adresse identifier / Numéro de telephone / Nom
                    d&apos;utilisateur
                  </label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="nom@company.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ibi-color-1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" htmlFor="password">
                      Mot de passe
                    </label>
                    <Link
                      href="#"
                      className="text-sm text-ibi-color-4 hover:text-ibi-color-5"
                    >
                      Mot de passe oublié?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ibi-color-1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ibi-color-1 hover:bg-ibi-color-3 text-white p-3 rounded-lg transition-colors"
                >
                  Se connecter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-ibi-color-1 via-ibi-color-3 to-ibi-color-2 p-12">
        <div className="h-full flex flex-col justify-center">
          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-bold">Gestion de Flotte IBI Group</h2>
            <p className="text-xl">
              Optimisez la gestion de votre flotte de véhicules avec cette
              plateforme intuitive et performante.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Suivi en temps réel
                </h3>
                <p>Localisez et surveillez votre flotte en temps réel</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Gestion simplifiée
                </h3>
                <p>Gérez facilement les allocations et la maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
