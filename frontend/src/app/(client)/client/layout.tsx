"use client";

import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useState, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/use-auth";
export default function Layout({ children }: { children: React.ReactNode }) {

    const [queryClient] = useState(() => new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 60 * 1000, // 1 minute
              retry: 1
            }
          }
        }));

  return (
    <SidebarProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="sticky top-0 z-50">
            <Topbar />
          </div>
          <div className="flex-1 overflow-hidden">
            <main className="h-full overflow-y-auto overflow-x-auto max-w-full bg-gray-100 dark:bg-sms">
              <div className="min-w-fit max-w-full pb-4">{children}</div>
            </main>
          </div>
        </div>
      </div>
      </QueryClientProvider>
      </AuthProvider>
    </SidebarProvider>
  );
}
