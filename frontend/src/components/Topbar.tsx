"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Leaf,
  ChevronDown,
  Filter,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  const { toggleSidebar, state: isCollapsed } = useSidebar();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen((prevState) => !prevState);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Could not enter fullscreen mode:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Could not exit fullscreen mode:", err);
        });
      }
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
      className={`flex justify-between items-center px-4 md:px-6 py-3 sticky top-0 z-50 bg-secondary-light sticky overflow-hidden w-full
        ${
          scrolled
            ? "bg-secondary-light dark:bg-emerald-950/90 backdrop-blur-md shadow-md"
            : "bg-secondary-light from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 shadow-lg"
        } 
        border-b border-emerald-200 dark:border-emerald-700 transition-all duration-300`}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
        >
          <Menu className="w-6 h-6 text-emerald-700 dark:text-emerald-200" />
        </motion.button>

        {/* Logo and Branding - ALWAYS VISIBLE */}
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-emerald-600 p-2 rounded-lg shadow-lg flex-shrink-0"
          >
            <Leaf className="w-6 h-6 text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-emerald-800 dark:text-emerald-100 whitespace-nowrap">
              GREENALYTIC MOTORS
            </h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-300 whitespace-nowrap">
              Data Insights Platform
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-1 items-center justify-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search clients, vehicles, or devices..."
                    className="w-full bg-background pl-8 pr-8 focus-visible:ring-emerald-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                  >
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSearch((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
          aria-label={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
          )}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel("notifications")}
          className="relative p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
            3
          </span>
        </motion.button>

        {/* Fullscreen Toggle - Hidden on mobile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          className="hidden md:block p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
          ) : (
            <Maximize className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
          )}
        </motion.button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePanel("profile")}
              className="flex items-center space-x-1 p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
              aria-label="Profile"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center overflow-hidden border-2 border-emerald-300 dark:border-emerald-600">
                  <User className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-emerald-800"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-emerald-700 dark:text-emerald-200 hidden md:block" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>System Configuration</DropdownMenuItem>
            <DropdownMenuItem>User Management</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Panels */}
    </motion.div>
  );
};
