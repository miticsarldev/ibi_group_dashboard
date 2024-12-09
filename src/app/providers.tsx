"use client";

import { Provider } from "react-redux";
import { store } from "../lib/store";
import { GlobalParametersProvider } from "@/contexts/GlobalParametersContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GlobalParametersProvider>{children}</GlobalParametersProvider>
    </Provider>
  );
}
