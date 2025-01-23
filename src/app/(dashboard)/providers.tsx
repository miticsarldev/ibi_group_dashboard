"use client";

import { Provider } from "react-redux";
import { GlobalParametersProvider } from "@/contexts/GlobalParametersContext";
import { store } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GlobalParametersProvider>{children}</GlobalParametersProvider>
    </Provider>
  );
}
