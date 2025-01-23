"use client";

import MainContent from "@/components/main";
import { Providers } from "./providers";
import { useFirebase } from "@/hooks/useFirebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader size="large" color="primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Providers>
      <MainContent>{children}</MainContent>
    </Providers>
  );
}
