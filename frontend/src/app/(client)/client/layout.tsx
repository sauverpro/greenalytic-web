"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("USER_ROLE");
      setRole(storedRole);


      if (storedRole === "admin") {
        router.push("/admin");
      } else if (storedRole === "user") {
        router.push("/client");
      } else {
        router.push("/login");
      }
    }
  }, [router]);


  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="sticky top-0 z-50">
            <Topbar />
          </div>
          <div className="flex-1 overflow-hidden">
            <main className="h-full overflow-y-auto overflow-x-auto max-w-full bg-gray-100 dark:bg-gray-900">
              <div className="min-w-fit max-w-full pb-4">
                { children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
