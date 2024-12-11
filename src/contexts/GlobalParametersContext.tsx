"use client";

import { GlobalParameters } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";

interface GlobalParametersContextType {
  parameters: GlobalParameters;
  updateParameters: (newParameters: GlobalParameters) => void;
}

const GlobalParametersContext = createContext<
  GlobalParametersContextType | undefined
>(undefined);

export function GlobalParametersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [parameters, setParameters] = useState<GlobalParameters>({
    carAmount: "25000",
    motorbikeAmount: "4800",
    chargingStationRate: "1000",
    maintenanceThreshold: "5000",
    defaultCurrency: "FCFA",
    language: "fr",
    darkMode: false,
    notificationsEnabled: true,
  });

  useEffect(() => {
    const storedParameters = localStorage.getItem("globalParameters");
    if (storedParameters) {
      setParameters(JSON.parse(storedParameters));
    }
  }, []);

  const updateParameters = (newParameters: GlobalParameters) => {
    setParameters((prevParameters) => ({
      ...prevParameters,
      ...newParameters,
    }));
    localStorage.setItem(
      "globalParameters",
      JSON.stringify({
        ...parameters,
        ...newParameters,
      })
    );
  };

  return (
    <GlobalParametersContext.Provider value={{ parameters, updateParameters }}>
      {children}
    </GlobalParametersContext.Provider>
  );
}

export function useGlobalParameters() {
  const context = useContext(GlobalParametersContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalParameters must be used within a GlobalParametersProvider"
    );
  }
  return context;
}
