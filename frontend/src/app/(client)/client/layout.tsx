"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function Loader() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("USER_ROLE");
      setRole(storedRole);
      setIsLoading(false);

      if (storedRole === "admin") {
        router.push("/admin");
      } else if (storedRole === "user") {
        router.push("/client");
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full ">
          <div className="sticky top-0 z-50 overflow-hidden">
            <Topbar />
          </div>
          <main className="h-100vh overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
