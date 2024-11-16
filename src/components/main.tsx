"use client";

import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  console.log(pathname);

  if (pathname === "/login") {
    return children;
  }

  return (
    <SidebarProvider>
      <SidebarInset className="max-w-full overflow-hidden">
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            <div className="flex h-14 items-center border-b px-4">
              <SidebarTrigger />
            </div>
            <div className="p-4 w-full h-full">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainContent;
