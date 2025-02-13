// src/components/ui/sidebar/AnimatedSidebar.tsx

"use client";
import React, { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";


import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,  SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// Icons
import { Home,  Users, BarChart2, MessageSquare, FileText, Bell,MapPin } from "lucide-react";

// Define the menu items
const items = [
  { title: "Dashboard", url: "/..", icon: Home },
  { title: "users", url: "#", icon: BarChart2 },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Messages", url: "#", icon: MessageSquare },
  { title: "Reports", url: "#", icon: FileText },
  { title: "map", url: "/dashboard/map", icon: MapPin },
];

// const tasks = [
//   { task: "Finish Dashboard UI", status: "in-progress" },
//   { task: "Update Client Data", status: "pending" },
//   { task: "Review Sales Reports", status: "completed" },
// ];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { state: isCollapsed } = useSidebar();


  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="relative top-16">
  

        {/* Navigation Menu */}
        <SidebarGroup>
        
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      onClick={() => setActiveItem(item.title)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-200 ${
                        activeItem === item.title
                          ? "bg-gray-200 dark:bg-gray-700"
                          : ""
                      }`}>
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon className="h-6 w-6" />
                        </TooltipTrigger>
                        <TooltipContent>{item.title}</TooltipContent>
                      </Tooltip>
                      {isCollapsed === "expanded" && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

   
      </SidebarContent>
    </Sidebar>
  );
}
