"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import {
  X,
  Sun,
  Moon,
  Bell,
  Maximize,
  Minimize,
  Search,
  Menu,
  User
} from "lucide-react";
import logo from "../../public/images/logo.png";

import MessagesPanel from "./TopBarPanels/MessagesPanel";
import NotificationsPanel from "./TopBarPanels/NotificationsPanel";
import ProfilePanel from "./TopBarPanels/ProfilePanel";
import VisibleControlSidebar from "./TopBarPanels/VisibleControlSidebar";

// Panel Types
type PanelType =
  | "notifications"
  | "messages"
  | "profile"
  | "SidebarPanel"
  | null;

export const Topbar = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { toggleSidebar } = useSidebar();

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    setIsFullscreen((prevState) => !prevState);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  // Toggle Sidebar Panel
  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-between items-center px-4 py-2 sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b-2">
      {/* Left Section (Menu & Logo) */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition" />
        </button>

        {/* Centered Logo */}
        <motion.img
          src={logo.src}
          alt="Company Logo"
          className="h-10 w-10 rounded-full absolute left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Right Section (Search, Icons, Profile) */}
      <div className="flex items-center space-x-4">
        {/* Search Bar Reveal */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: showSearch ? 200 : 0, opacity: showSearch ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden">
          <input
            type="text"
            placeholder="Search..."
            className="px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </motion.div>

        <button onClick={() => setShowSearch((prev) => !prev)}>
          <Search className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition" />
        </button>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode}>
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => togglePanel("notifications")}
          className="relative">
          <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Fullscreen Toggle */}
        <button onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Maximize className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Profile */}
        <button onClick={() => togglePanel("profile")}>
          <User className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition" />
        </button>
      </div>

      {/* Sidebar Panels (Notifications, Profile, etc.) */}
      {activePanel && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-0 w-80 h-full border-l p-4 bg-white dark:bg-gray-800 shadow-md transition-transform transform z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {activePanel === "SidebarPanel"
                ? "Sidebar Control"
                : activePanel === "notifications"
                ? "Notifications"
                : activePanel === "messages"
                ? "Messages"
                : "User Profile"}
            </h2>
            <button onClick={() => setActivePanel(null)}>
              <X className="w-5 h-5 text-gray-600 dark:text-white" />
            </button>
          </div>

          {activePanel === "SidebarPanel" && <VisibleControlSidebar />}
          {activePanel === "notifications" && <NotificationsPanel />}
          {activePanel === "messages" && <MessagesPanel />}
          {activePanel === "profile" && <ProfilePanel />}
        </motion.div>
      )}
    </motion.div>
  );
};
