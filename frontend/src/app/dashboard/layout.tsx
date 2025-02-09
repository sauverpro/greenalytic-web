import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-1 w-full">
        <Topbar />

        <div className="flex">
          <AppSidebar  />
          <main className="flex-1 w-full  h-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
