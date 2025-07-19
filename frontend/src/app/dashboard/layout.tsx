
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/use-auth";


export default function Layout({ children }: { children: React.ReactNode }) {


  return <SidebarProvider>

       <div className="flex w-full h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
              <div className="sticky top-0 z-50">
                <Topbar />
              </div>
              <div className="flex-1 overflow-hidden px-3 py-6">
                <main className="h-full overflow-y-auto overflow-x-auto bg-gray-100 dark:bg-sms">
                  <div className="w-full">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </div>


    </SidebarProvider>;
}
