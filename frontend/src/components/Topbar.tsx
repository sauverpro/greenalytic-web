"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  User,
  Leaf
} from "lucide-react";
import logo from "../../public/images/logo.png";

import MessagesPanel from "./TopBarPanels/MessagesPanel";
import NotificationsPanel from "./TopBarPanels/NotificationsPanel";
import ProfilePanel from "./TopBarPanels/ProfilePanel";
import VisibleControlSidebar from "./TopBarPanels/VisibleControlSidebar";

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
  const { state: isCollapsed } = useSidebar();
  const toggleFullscreen = () => {
    setIsFullscreen((prevState) => !prevState);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-between items-center px-6 py-3 sticky top-0 z-50 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 shadow-lg border-b border-emerald-200 dark:border-emerald-700 w-full">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {/* Logo Section */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
          <Menu className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
        </motion.button>
        {isCollapsed !== "expanded" && (
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-emerald-600 p-2 rounded-lg shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
                GREENALYTIC MOTORS
              </h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-300">
                Data Insights Platform
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 rounded-full bg-white dark:bg-emerald-800 border border-emerald-300 dark:border-emerald-600 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-emerald-100 
                         placeholder-emerald-400 dark:placeholder-emerald-500 w-48 md:w-64"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSearch((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
          <Search className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
          )}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel("notifications")}
          className="relative p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
          <Bell className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            3
          </span>
        </motion.button>

        {/* Fullscreen Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
          {isFullscreen ? (
            <Minimize className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
          ) : (
            <Maximize className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
          )}
        </motion.button>

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel("profile")}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
          <User className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
        </motion.button>
      </div>

      {/* Panels */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
            className="fixed top-20 right-0 w-80 h-[calc(100vh-5rem)] border-l border-emerald-200 dark:border-emerald-700 
                     bg-white dark:bg-emerald-900 shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-emerald-50 dark:bg-emerald-800 p-4 border-b border-emerald-200 dark:border-emerald-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
                  {activePanel === "SidebarPanel"
                    ? "Sidebar Control"
                    : activePanel === "notifications"
                    ? "Notifications"
                    : activePanel === "messages"
                    ? "Messages"
                    : "User Profile"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePanel(null)}
                  className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors">
                  <X className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
                </motion.button>
              </div>
            </div>

            <div className="p-4">
              {activePanel === "SidebarPanel" && <VisibleControlSidebar />}
              {activePanel === "notifications" && <NotificationsPanel />}
              {activePanel === "messages" && <MessagesPanel />}
              {activePanel === "profile" && <ProfilePanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
