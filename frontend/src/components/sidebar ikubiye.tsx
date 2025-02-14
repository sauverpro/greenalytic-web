"use client";
import React, { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "../../public/images/logo.png";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
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

import {
  Home,
  Users,
  BarChart2,
  MessageSquare,
  FileText,
  Bell,
  MapPin,
  Leaf
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Users", url: "#", icon: BarChart2 },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Messages", url: "#", icon: MessageSquare },
  { title: "Reports", url: "#", icon: FileText },
  { title: "Map", url: "/dashboard/map", icon: MapPin }
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { state: isCollapsed } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Sidebar
      collapsible="icon"
      className=" relative border-r border-emerald-600/20 shadow-lg ">
      <SidebarContent className="  bg-gradient-to-b from-emerald-800 to-emerald-900">
        {/* Logo and Branding */}
        <div className=" ">
           {isCollapsed === "expanded" && (
          <div className="flex   flex-col items-center space-x-3 text-white">
            <Image
              src={logo}
              alt="GreenAlytics Logo"
              // width={60}
              // height={60}
              className="w-230 h-24 "
            />
            {isCollapsed === "expanded" && (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-emerald-50 font-bold text-lg ">
                  GREENALYTIC MOTORS
                </h2>
                <p className="text-emerald-300 text-xs">
                  Data Insights Platform
                </p>
              </div>
            )}
          </div>)}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 py-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      onClick={() => setActiveItem(item.title)}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex items-center space-x-3 px-4 py-3 my-1.5 rounded-lg transition-all duration-300 relative
                        ${
                          activeItem === item.title
                            ? "bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-900/30 border border-emerald-500 -translate-x-1"
                            : "text-emerald-100 hover:bg-emerald-700/30"
                        }
                        ${
                          hoveredItem === item.title &&
                          activeItem !== item.title
                            ? "bg-emerald-700/40 scale-105 shadow-md -translate-x-2 border border-emerald-600/30"
                            : ""
                        }
                        before:absolute before:left-0 before:w-1 before:h-full before:bg-emerald-400
                        before:rounded-full before:opacity-0 before:transition-all
                        ${
                          activeItem === item.title
                            ? "before:opacity-100"
                            : hoveredItem === item.title
                            ? "before:opacity-50"
                            : ""
                        }
                      `}>
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon
                            className={`h-5 w-5 transition-transform duration-300
                              ${
                                activeItem === item.title
                                  ? "text-white scale-110"
                                  : hoveredItem === item.title
                                  ? "text-emerald-100 scale-105"
                                  : "text-emerald-200"
                              }
                            `}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-emerald-900 text-emerald-50 border-emerald-700 shadow-xl">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                      {isCollapsed === "expanded" && (
                        <span
                          className={`transition-all duration-300
                          ${
                            activeItem === item.title
                              ? "font-semibold"
                              : hoveredItem === item.title
                              ? "text-emerald-50"
                              : ""
                          }
                        `}>
                          {item.title}
                        </span>
                      )}

                      {/* Active indicator dot */}
                      {activeItem === item.title && (
                        <span className="absolute right-2 w-2 h-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/50"></span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-700 bg-emerald-800/50">
          {isCollapsed === "expanded" && (
            <div className="flex items-center justify-center space-x-2">
              <Leaf className="h-4 w-4 text-emerald-400" />
              <p className="text-emerald-200 text-sm">GreenAlytics</p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
