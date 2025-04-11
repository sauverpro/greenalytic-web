"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("USER_ROLE");
      const token = localStorage.getItem("AUTH_TOKEN");

      setRole(storedRole);

      if (!token) {
        if (pathname !== "/login") {
          router.push("/login");
        }
      } else if (storedRole === "admin") {
        if (!pathname.startsWith("/admin")) {
          router.push("/admin");
        }
      } else if (storedRole === "user") {
        if (!pathname.startsWith("/client")) {
          router.push("/client");
        }
      }

      setAuthChecked(true);
      setIsLoading(false);
    }
  }, [pathname, router]);

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="sticky top-0 z-50">
            <Topbar />
          </div>
          <div className="flex-1 overflow-hidden">
            <main className="h-full overflow-y-auto overflow-x-auto bg-gray-100 dark:bg-sms">
              <div className="w-full pb-4">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
