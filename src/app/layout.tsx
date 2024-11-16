import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
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
      </body>
    </html>
  );
}
