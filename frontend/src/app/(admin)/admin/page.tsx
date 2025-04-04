"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Calendar, Car, Download, Fuel, Plus, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RecentActivityCard,
  SystemAlertsCard,
} from "@/components/adminComponents/activityCards";
import ClientGrowthChart from "@/components/adminComponents/client-growth-chart";
import { format } from "date-fns";
import EmissionsChart from "@/components/adminComponents/emissionsChart";
import MapWrapper from "@/components/adminComponents/mapWrapper";
import { GPSMetricCard, FuelMetricCard, EmissionsMetricCard } from "@/components/adminComponents/metricCards";
import { getAllDataInSystem, getAnalyticsData, getMapData } from "@/services/vehicleData";
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
  const [timeframe, setTimeframe] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemData, setSystemData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Calculate date range based on selected timeframe
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  };

  // Fetch data for the dashboard
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dateRange = getDateRange();

        // Fetch all data in parallel for better performance
        const [systemResponse, analyticsResponse, mapResponse] =
          await Promise.all([
            getAllDataInSystem(),
            getAnalyticsData(),
            getMapData(),
          ]);

        setSystemData(systemResponse);
        setAnalyticsData(analyticsResponse);

        console.log("System Data:", systemResponse);
        console.log("Analytics Data:", analyticsResponse);

        setMapData(mapResponse);

        console.log("map response Data fetched successfully", mapResponse);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeframe, refreshTrigger]);

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Extract summary metrics from data
  const getSummaryMetrics = () => {
    if (!systemData || !systemData.summary) {
      return {
        averageCO2: 0,
        averageFuelConsumption: 0,
        averageSpeed: 0,
      };
    }

    return systemData.summary;
  };

  // Get analytics data
  const getAnalyticsMetrics = () => {
    if (!analyticsData || !analyticsData.analytics) {
      return {
        emissions: null,
        fuel: null,
        gps: null,
      };
    }

    return analyticsData.analytics;
  };

  const summary = getSummaryMetrics();
  const analytics = getAnalyticsMetrics();

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
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Loading..." : "Refresh Data"}
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {/* <Button
              size="sm"
              className="h-9 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button> */}
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
            </TabsList>

            <div className="flex items-center gap-2">
              <Select
                defaultValue="today"
                onValueChange={(value) => setTimeframe(value)}
              >
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Total Vehicles"
                value={mapData?.totalVehicles?.toString() || "0"}
                // value={analytics?.gps?.activeVehicles?.toString() || "0"}
                change={"All"}
                trend="up"
                description="All vehicles in the system"
                icon={<Car className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="Average Speed"
                value={`${summary.averageSpeed?.toFixed(1) || 0}`}
                change={analytics?.gps?.highSpeedCount > 10 ? "High" : "Normal"}
                trend={analytics?.gps?.highSpeedCount > 10 ? "down" : "neutral"}
                description="km/h across all vehicles"
                icon={<Car className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="Fuel Consumption"
                value={`${summary.averageFuelConsumption?.toFixed(1) || 0}`}
                change={
                  analytics?.fuel?.highConsumptionCount > 30 ? "High" : "Normal"
                }
                trend={
                  analytics?.fuel?.highConsumptionCount > 30 ? "down" : "up"
                }
                description="L/100km average"
                icon={<Fuel className="h-5 w-5 text-emerald-600" />}
              />
            </div>

            {/* Small Metric Data Cards */}
            <div className="grid grid-cols-3 gap-3">
              <GPSMetricCard
                value={analytics?.gps?.speed?.average?.toFixed(1) || "0"}
                status={
                  analytics?.gps?.highSpeedCount > 20 ? "warning" : "normal"
                }
              />
              <FuelMetricCard
                value={analytics?.fuel?.level?.average?.toFixed(1) || "0"}
                status={
                  analytics?.fuel?.lowFuelCount > 0 ? "warning" : "normal"
                }
              />
              <EmissionsMetricCard
                value={analytics?.emissions?.co2?.average?.toFixed(1) || "0"}
                status={
                  analytics?.emissions?.anomalies > 50 ? "critical" : "warning"
                }
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ClientGrowthChart
                isLoading={isLoading}
                data={systemData?.data?.gps || []}
              />
              <EmissionsChart
                isLoading={isLoading}
                data={analyticsData?.analytics?.emissions || {}}
              />
            </div>

            {/* Recent Activity & Alerts */}
            <ActivityAndAlertsSection
              isLoading={isLoading}
              emissions={systemData?.data?.emissions || []}
              fuels={systemData?.data?.fuels || []}
              gps={systemData?.data?.gps || []}
            />

            {/* Client Map */}
            <Card className="mt-6">
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
                      Vehicles with GPS: {mapData?.vehiclesWithGpsData || 0}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <div className="mr-1 h-2 w-2 rounded-full bg-gray-500" />
                      Without GPS:{" "}
                      {(mapData?.totalVehicles || 0) -
                        (mapData?.vehiclesWithGpsData || 0)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <MapWrapper
                  isLoading={isLoading}
                  vehicles={
                    mapData?.mapData?.map((vehicle:any) => ({
                      position: {
                        lat: vehicle.latitude,
                        lng: vehicle.longitude,
                      },
                      plateNumber: vehicle.plateNumber,
                      vehicleId: vehicle.vehicleId,
                      speed: vehicle.speed,
                      isActive: vehicle.trackingStatus,
                      lastSeen: vehicle.timestamp,
                    })) || []
                  }
                  stats={{
                    totalVehicles: mapData?.totalVehicles || 0,
                    activeVehicles: mapData?.vehiclesWithGpsData || 0,
                    inactiveVehicles:
                      (mapData?.totalVehicles || 0) -
                      (mapData?.vehiclesWithGpsData || 0),
                  }}
                />
              </CardContent>
            </Card>
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
              <UserTable />
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

// Activity and Alerts Section
function ActivityAndAlertsSection({
  isLoading,
  emissions,
  fuels,
  gps,
}: {
  isLoading: boolean;
  emissions: any[];
  fuels: any[];
  gps: any[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RecentActivityCard isLoading={isLoading} data={gps} />
      <SystemAlertsCard
        isLoading={isLoading}
        emissions={emissions}
        fuels={fuels}
        gps={gps}
      />
    </div>
  );
}
