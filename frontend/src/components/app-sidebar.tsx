"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter} from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Card, CardContent } from "@/components/ui/card";

import {
  Home,
  Users,
  LocateFixed,
  Fuel,
  Router,
  Settings,
  MessageSquare,
  MapPin,
  Leaf,
  Sparkles,
  LogOut,
  ChevronRight,
  Truck,
  Gauge,
  BarChart3,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import { handleLogout } from "../services/userService";

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Messages", url: "#", icon: MessageSquare },
  { title: "Vehicles", url: "/admin/vehicles", icon: Truck },
  { title: "Devices", url: "/admin/devices", icon: Gauge },
  { title: "System Settings", url: "#", icon: Settings },
  { title: "Help Center", url: "#", icon: HelpCircle },
];

const clientItems = [
  { title: "Dashboard", url: "/client", icon: Home },
  { title: "GPS Tracking", url: "/client/gps", icon: LocateFixed },
  { title: "Fuel Analytics", url: "/client/fuels", icon: Fuel },
  { title: "Emissions Data", url: "/client/emissions", icon: Router },
  { title: "Live Vehicle Status", url: "#", icon: Sparkles },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state: isCollapsed } = useSidebar();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [items, setItems] = useState(clientItems);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const currentPath = pathname;
    const currentItem = [...adminItems, ...clientItems].find(
      (item) =>
        currentPath === item.url || currentPath.startsWith(`${item.url}/`)
    );

    if (currentItem) {
      setActiveItem(currentItem.title);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("USER_ROLE");
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      router.push("/login");
    } else if (role === "admin") {
      setItems(adminItems);
    } else {
      setItems(clientItems);
    }
  }, [router]);

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    const loggedOut = handleLogout();
    if (loggedOut) {
      router.push("/");
    }
  };

  const LogoBranding = () => (
    <Card
      className={`relative overflow-hidden border-0  my-4 bg-gradient-to-br from-emerald-800 to-emerald-900 shadow-lg shadow-emerald-900/30
        ${isCollapsed === "expanded" ? "mx-3 p-3" : "mx-1 p-1"}`}
      onMouseEnter={() => setIsLogoHovered(true)}
      onMouseLeave={() => setIsLogoHovered(false)}
    >
      <CardContent className="flex flex-col items-center p-0">
        {isCollapsed === "expanded" ? (
          <>
            <motion.div
              animate={{ scale: isLogoHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative group w-full flex justify-center py-3"
            >
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
              <div className="h-20 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="GreenAlytics Logo"
                  width={300}
                  height={80}
                  className="w-full h-auto object-contain object-center transform hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center space-y-1 mt-1 mb-2 px-2"
            ></motion.div>
          </>
        ) : (
          <div className="flex items-center justify-center py-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-700 rounded-full p-1.5 shadow-lg"
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Sidebar
      collapsible="icon"
      className={`fixed top-0 border-r border-emerald-700/30 shadow-xl h-screen overflow-hidden
        ${isCollapsed === "expanded" ? "w-64" : "w-20"}
        transition-all duration-300 ease-in-out`}
    >
      <SidebarContent className="bg-primary-darker from-emerald-900 via-emerald-900 to-emerald-950 w-full h-full">
        <LogoBranding />

        <SidebarGroup className="h-[calc(100vh-16rem)]  overflow-y-auto px-2 pb-10">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <SidebarMenuButton
                        className="hover:bg-[#059669] "
                        asChild={true}
                      >
                        <Link
                          href={item.url}
                          onClick={() => setActiveItem(item.title)}
                          className={`flex items-center transition-all duration-300 relative my-1.5 py-3 rounded-xl
                            ${
                              isCollapsed === "expanded"
                                ? "px-4 gap-3"
                                : "w-14 h-14 mx-auto justify-center"
                            }
                            ${
                              activeItem === item.title
                                ? "bg-[#059669] text-white font-medium shadow-lg shadow-emerald-900/30"
                                : `text-emerald-100 ${
                                    items.indexOf(item) % 2 === 0
                                      ? "hover:bg-[#059669]"
                                      : "hover:bg-[#059669]"
                                  }`
                            }`}
                        >
                          <TooltipTrigger>
                            <div className="flex items-center justify-center relative">
                              <item.icon
                                className={`w-6 h-6 transition-transform duration-300
                                ${
                                  activeItem === item.title
                                    ? "text-white"
                                    : "text-emerald-300"
                                }`}
                              />

                              {activeItem === item.title && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white shadow-lg shadow-orange-500/30"
                                />
                              )}
                            </div>
                          </TooltipTrigger>

                          {isCollapsed === "expanded" && (
                            <span
                              className={`transition-all duration-300 flex-1 ${
                                activeItem === item.title
                                  ? "text-white hover:text-white"
                                  : ""
                              }`}
                            >
                              {item.title}
                            </span>
                          )}

                          {isCollapsed === "expanded" &&
                            activeItem === item.title && (
                              <ChevronRight className="w-4 h-4 text-emerald-200" />
                            )}
                        </Link>
                      </SidebarMenuButton>

                      {isCollapsed !== "expanded" && (
                        <TooltipContent
                          side="right"
                          className="bg-emerald-900 text-emerald-50 border-emerald-700 shadow-xl"
                        >
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="absolute bottom-[3.5rem] w-full px-3">
          <SidebarMenuItem>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <SidebarMenuButton asChild={true}>
                  <button
                    onClick={onLogout}
                    className={`flex items-center justify-center relative py-3 rounded-xl w-full
                      ${
                        isCollapsed === "expanded"
                          ? "px-4 gap-3"
                          : "w-14 h-14 mx-auto justify-center"
                      }
                      bg-gradient-to-b hover:from-emerald-600 hover:to-emerald-700 text-white hover:text-white font-medium shadow-lg `}
                  >
                    {/* <TooltipTrigger>
                      <div className="flex items-center justify-center">
                        <LogOut className="w-6 h-6 transition-transform duration-300 text-red-300" />
                      </div>
                    </TooltipTrigger> */}

                    {isCollapsed === "expanded" && (
                      <span className="transition-all duration-300 font-medium">
                        Logout
                      </span>
                    )}
                  </button>
                </SidebarMenuButton>

                {isCollapsed !== "expanded" && (
                  <TooltipContent
                    side="right"
                    className="bg-red text-red-50 border shadow-xl"
                  >
                    Logout
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-700/50 bg-emerald-950/50">
          {isCollapsed === "expanded" ? (
            <div className="flex items-center justify-center space-x-2">
              <Leaf className="h-4 w-4 text-emerald-400" />
              <p className="text-emerald-400 text-xs">
                © 2023 GREENALYTIC MOTORS
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <Leaf className="h-4 w-4 text-emerald-400" />
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
