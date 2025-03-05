
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full">
          <Topbar />
          <main className="h-100vh overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
