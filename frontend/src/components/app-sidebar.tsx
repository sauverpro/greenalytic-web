"use client";
import React, { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

import { Card, CardContent } from "@/components/ui/card";

import {
  Home,
  Users,
  BarChart2,
  MessageSquare,
  FileText,
  Bell,
  MapPin,
  Leaf,
  Sparkles
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Users", url: "/dashboard/users", icon: BarChart2 },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Messages", url: "#", icon: MessageSquare },
  { title: "Reports", url: "#", icon: FileText },
  { title: "Map", url: "/dashboard/map", icon: MapPin }
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { state: isCollapsed } = useSidebar();
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Logo Branding with Card Design
  const LogoBranding = () => (
    <Card
      className={`relative bg-emerald-900/50 border border-emerald-700 shadow-lg shadow-emerald-500/20 rounded-lg overflow-hidden mb-4 
        ${isCollapsed === "expanded" ? "p-2" : "p-2"}`}
      onMouseEnter={() => setIsLogoHovered(true)}
      onMouseLeave={() => setIsLogoHovered(false)}>
      <CardContent className="flex flex-col items-center">
        {isCollapsed === "expanded" ? (
          <>
            {/* Logo with glow effect */}
            <motion.div
              animate={{ scale: isLogoHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative group">
              <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <Image
                src={logo}
                alt="GreenAlytics Logo"
                className="w-32 h-16 relative z-10"
              />
            </motion.div>

            {/* Animated title section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <h2 className="text-emerald-50 font-bold text-xl bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
                  GREENALYTIC MOTORS
                </h2>
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-emerald-300 text-sm font-medium tracking-wide">
                Data Insights Platform
              </p>
            </motion.div>
          </>
        ) : (
          <Image
            src={logo}
            alt="Logo"
            className="w-10 h-10 transition-all duration-300"
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Sidebar
      collapsible="icon"
      className={`fixed top-0 border-r border-emerald-600/20 shadow-lg h-[calc(100vh-4rem) overflow-y-auto] 
        ${isCollapsed === "expanded" ? "w-64" : "w-16"} 
        transition-all duration-300 ease-in-out`}>
      <SidebarContent className="bg-gradient-to-b from-emerald-800 to-emerald-900 w-full h-full">
        {/* Logo Branding Section */}
        <LogoBranding />

        {/* Navigation Menu */}
        <SidebarGroup className="h-3/4 overflow-y-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          onClick={() => setActiveItem(item.title)}
                          className={`flex items-center transition-all duration-300 relative my-2 py-4 rounded-lg
                            ${
                              isCollapsed === "expanded"
                                ? "px-4 gap-3"
                                : "w-12 h-12 mx-auto justify-center"
                            }
                            ${
                              activeItem === item.title
                                ? "bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-900/30 border border-emerald-500"
                                : "text-emerald-100 hover:bg-emerald-700/40"
                            }`}>
                          <TooltipTrigger>
                            <div className="flex items-center justify-center">
                              <item.icon
                                className={`w-8 h-8 transition-transform duration-300
                                ${
                                  activeItem === item.title
                                    ? "text-white scale-110"
                                    : "text-emerald-200"
                                }`}
                              />
                            </div>
                          </TooltipTrigger>
                          {isCollapsed === "expanded" && (
                            <span className="transition-all duration-300">
                              {item.title}
                            </span>
                          )}
                          {/* Active indicator dot */}
                          {activeItem === item.title && (
                            <span
                              className={`absolute w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-emerald-300/50
                              ${
                                isCollapsed === "expanded"
                                  ? "right-2"
                                  : "right-1"
                              }`}></span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                      {isCollapsed !== "expanded" && (
                        <TooltipContent
                          side="right"
                          className="bg-emerald-900 text-emerald-50 border-emerald-700 shadow-xl">
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

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-700 bg-emerald-800/50">
          {isCollapsed === "expanded" ? (
            <div className="flex items-center justify-center space-x-2">
              <Leaf className="h-4 w-4 text-emerald-400" />
              <p className="text-emerald-200 text-sm">GREENALYTIC MOTORS</p>
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
