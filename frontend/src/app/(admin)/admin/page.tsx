"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Car,
  Download,
  Fuel,
  LineChart,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserTable from "./users/UserTable";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <div className="flex flex-1 items-center gap-2">
          <Badge
            variant="outline"
            className="ml-2 bg-emerald-100 text-emerald-800 border-emerald-200"
          >
            Admin
          </Badge>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-emerald-900">
              Welcome back, Admin
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening across your platform today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              className="h-9 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="overview"
          className="space-y-6"
          onValueChange={setSelectedTab}
        >
          <div className="flex justify-between">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select defaultValue="today">
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="h-9 w-9">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Clients"
                value="128"
                change="+12%"
                trend="up"
                description="From previous period"
                icon={<Users className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="Active Vehicles"
                value="342"
                change="+8%"
                trend="up"
                description="Currently online"
                icon={<Car className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="Total Devices"
                value="512"
                change="+5%"
                trend="up"
                description="Deployed in the field"
                icon={<Fuel className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="System Health"
                value="98.7%"
                change="-0.3%"
                trend="down"
                description="Overall uptime"
                icon={<LineChart className="h-5 w-5 text-emerald-600" />}
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>Client Growth</CardTitle>
                    <CardDescription>
                      New client acquisitions over time
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Export Data</DropdownMenuItem>
                      <DropdownMenuItem>Set Alert</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-emerald-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Client Growth Chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>By type and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-emerald-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Device Distribution Chart
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Alerts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 rounded-lg border p-3"
                      >
                        <Avatar className="mt-1 h-9 w-9">
                          <AvatarFallback
                            className={`bg-emerald-${i * 100} text-white`}
                          >
                            {String.fromCharCode(64 + i)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            New client registered
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Client #{i} registered a new account and added 3
                            vehicles
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>System Alerts</CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-500 border-red-200"
                    >
                      5 New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Device Offline",
                        desc: "GPS Tracker #GT-2234 is offline for 3 hours",
                        severity: "high",
                      },
                      {
                        title: "Fuel Level Critical",
                        desc: "Vehicle R789B fuel level below 10%",
                        severity: "medium",
                      },
                      {
                        title: "Emissions Alert",
                        desc: "Vehicle T456C emissions above threshold",
                        severity: "high",
                      },
                      {
                        title: "System Update Required",
                        desc: "New firmware available for 23 devices",
                        severity: "low",
                      },
                      {
                        title: "License Expiring",
                        desc: "Client #45 license expires in 7 days",
                        severity: "medium",
                      },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 rounded-lg border p-3"
                      >
                        <div
                          className={`mt-1 h-2 w-2 rounded-full ${
                            alert.severity === "high"
                              ? "bg-red-500"
                              : alert.severity === "medium"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.desc}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                alert.severity === "high"
                                  ? "bg-red-50 text-red-500 border-red-200"
                                  : alert.severity === "medium"
                                  ? "bg-amber-50 text-amber-500 border-amber-200"
                                  : "bg-blue-50 text-blue-500 border-blue-200"
                              }`}
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              1 hour ago
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Map */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Client Vehicle Map</CardTitle>
                    <CardDescription>
                      Real-time location of all tracked vehicles
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                      Online: 287
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <div className="mr-1 h-2 w-2 rounded-full bg-gray-500" />
                      Offline: 55
                    </Badge>
                    <Button variant="outline" size="sm" className="h-8">
                      <MapPin className="mr-2 h-3 w-3" />
                      Expand Map
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-emerald-50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Interactive Map with Vehicle Locations
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Clients Table */}
            <UserTable />
          </TabsContent>

          {/* Other Tabs Content */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients Management</CardTitle>
                <CardDescription>
                  View and manage all client accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Clients Management Interface
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicles Management</CardTitle>
                <CardDescription>
                  View and manage all registered vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Vehicles Management Interface
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Devices Management</CardTitle>
                <CardDescription>
                  View and manage all tracking devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Devices Management Interface
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed platform analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Advanced Analytics Dashboard
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Metric Card Component with proper TypeScript typing
function MetricCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{value}</p>
              <Badge
                className={`${
                  trend === "up"
                    ? "bg-green-100 text-green-700"
                    : trend === "down"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-emerald-50 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
