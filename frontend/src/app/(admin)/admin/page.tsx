"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Calendar,
  Car,
  Download,
  Fuel,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
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
import ClientGrowthChart from "@/components/adminComponents/client-growth-chart";
import { format } from "date-fns";
import EmissionsChart from "@/components/adminComponents/emissionsChart";
import MapWrapper from "@/components/adminComponents/mapWrapper";
import {
  GPSMetricCard,
  FuelMetricCard,
  EmissionsMetricCard,
} from "@/components/adminComponents/metricCards";
// Dummy DashboardData example
const dummyDashboardData: DashboardData = {
  success: true,
  timestamp: new Date().toISOString(),
  counts: {
    users: 150,
    vehicles: 120,
    devices: 80,
    gpsData: 75,
    fuelData: 65,
    emissionData: 50,
  },
  analytics: {
    gps: {
      speed: {
        average: 60,
        min: 20,
        max: 120,
      },
      activeVehicles: 90,
      movingVehicles: 60,
      stoppedVehicles: 30,
      highSpeedCount: 15,
    },
    fuel: {
      consumption: {
        average: 8.5,
        min: 3,
        max: 15,
      },
      level: {
        average: 40,
        min: 5,
        max: 90,
      },
      lowFuelCount: 10,
      highConsumptionCount: 8,
    },
    emissions: {
      co2: {
        average: 120,
        min: 50,
        max: 200,
      },
      co: {
        average: 30,
        min: 10,
        max: 50,
      },
      o2: {
        average: 18,
        min: 15,
        max: 20,
      },
      hc: {
        average: 5,
        min: 1,
        max: 10,
      },
      anomalies: 3,
    },
  },
};

// Dummy MapData example
const dummyMapData: MapData = {
  totalVehicles: 120,
  vehiclesWithGpsData: 75,
  mapData: [
    {
      latitude: -1.957875,
      longitude: 30.112452,
      plateNumber: "RAB 123A",
      vehicleId: "veh001",
      speed: 60,
      trackingStatus: true,
      timestamp: new Date().toISOString(),
    },
    {
      latitude: -1.950000,
      longitude: 30.100000,
      plateNumber: "RAB 456B",
      vehicleId: "veh002",
      speed: 0,
      trackingStatus: false,
      timestamp: new Date().toISOString(),
    },
    {
      latitude: -1.940000,
      longitude: 30.120000,
      plateNumber: "RAB 789C",
      vehicleId: "veh003",
      speed: 45,
      trackingStatus: true,
      timestamp: new Date().toISOString(),
    },
  ],
};


interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
  icon: React.ReactNode;
}

// Define TypeScript interfaces for better type checking
interface DashboardData {
  success: boolean;
  timestamp: string;
  counts: {
    users: number;
    vehicles: number;
    devices: number;
    gpsData: number;
    fuelData: number;
    emissionData: number;
  };
  analytics: {
    gps: {
      speed: {
        average: number;
        min: number;
        max: number;
      };
      activeVehicles: number;
      movingVehicles: number;
      stoppedVehicles: number;
      highSpeedCount: number;
    } | null;
    fuel: {
      consumption: {
        average: number;
        min: number;
        max: number;
      };
      level: {
        average: number;
        min: number;
        max: number;
      };
      lowFuelCount: number;
      highConsumptionCount: number;
    } | null;
    emissions: {
      co2: {
        average: number;
        min: number;
        max: number;
      };
      co: {
        average: number;
        min: number;
        max: number;
      };
      o2: {
        average: number;
        min: number;
        max: number;
      };
      hc: {
        average: number;
        min: number;
        max: number;
      };
      anomalies: number;
    } | null;
  };
}

interface MapData {
  totalVehicles: number;
  vehiclesWithGpsData: number;
  mapData: Array<{
    latitude: number;
    longitude: number;
    plateNumber: string;
    vehicleId: string;
    speed: number;
    trackingStatus: boolean;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Map the UI timeframe values to backend timeFilter values
  const mapTimeframeToFilter = (timeframe: string) => {
    const mapping: Record<string, string> = {
      today: "today",
      yesterday: "yesterday", // Note: Backend needs to handle this case
      week: "week",
      month: "month",
      quarter: "quarter",
      year: "year",
      all: "all",
    };
    return mapping[timeframe] || "today";
  };



  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Extract summary metrics from dashboard data with null checks
  const getSummaryMetrics = () => {
    if (!dashboardData || !dashboardData.analytics) {
      return {
        averageCO2: 0,
        averageFuelConsumption: 0,
        averageSpeed: 0,
      };
    }

    return {
      averageCO2: dashboardData.analytics.emissions?.co2?.average || 0,
      averageFuelConsumption:
        dashboardData.analytics.fuel?.consumption?.average || 0,
      averageSpeed: dashboardData.analytics.gps?.speed?.average || 0,
    };
  };

  // Get analytics metrics directly from dashboard data
  const getAnalyticsMetrics = () => {
    if (!dashboardData || !dashboardData.analytics) {
      return {
        emissions: null,
        fuel: null,
        gps: null,
      };
    }

    return dashboardData.analytics;
  };

  const summary = getSummaryMetrics();
  const analytics = getAnalyticsMetrics();

  // Get date range display for the selected timeframe
  const getDateRangeDisplay = () => {
    const now = new Date();
    let start = new Date();

    switch (timeFilter) {
      case "today":
        return `Today (${format(now, "MMM d, yyyy")})`;
      case "yesterday":
        start.setDate(start.getDate() - 1);
        return `Yesterday (${format(start, "MMM d, yyyy")})`;
      case "week":
        start.setDate(start.getDate() - 7);
        return `Last 7 days (${format(start, "MMM d")} - ${format(
          now,
          "MMM d, yyyy"
        )})`;
      case "month":
        start.setMonth(start.getMonth() - 1);
        return `Last 30 days (${format(start, "MMM d")} - ${format(
          now,
          "MMM d, yyyy"
        )})`;
      case "quarter":
        start.setMonth(start.getMonth() - 3);
        return `Last quarter (${format(start, "MMM d")} - ${format(
          now,
          "MMM d, yyyy"
        )})`;
      case "year":
        start.setFullYear(start.getFullYear() - 1);
        return `Last year (${format(start, "MMM yyyy")} - ${format(
          now,
          "MMM yyyy"
        )})`;
      case "all":
        return "All time";
      default:
        return "Today";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className=" top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
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
            <p className="text-muted-foreground">{getDateRangeDisplay()}</p>
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
              {/* <TabsTrigger value="clients">Clients</TabsTrigger> */}
            </TabsList>

            <div className="flex items-center gap-2">
              <Select
                defaultValue="today"
                onValueChange={(value) => setTimeFilter(value)}
                value={timeFilter}
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
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="h-9 w-9">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Total Vehicles"
                value={dashboardData?.counts?.vehicles?.toString() || "0"}
                change={"All"}
                trend="up"
                description="All vehicles in the system"
                icon={<Car className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="Average Speed"
                value={`${summary.averageSpeed?.toFixed(1) || 0}`}
                change={
                  (analytics?.gps?.highSpeedCount ?? 0) > 10 ? "High" : "Normal"
                }
                trend={
                  (analytics?.gps?.highSpeedCount ?? 0) > 10
                    ? "down"
                    : "neutral"
                }
                description="km/h across all vehicles"
                icon={<Car className="h-5 w-5 text-emerald-600" />}
              />
              <MetricCard
                title="Fuel Consumption"
                value={`${summary.averageFuelConsumption?.toFixed(1) || 0}`}
                change={
                  (analytics?.fuel?.highConsumptionCount ?? 0) > 30
                    ? "High"
                    : "Normal"
                }
                trend={
                  (analytics?.fuel?.highConsumptionCount ?? 0) > 30
                    ? "down"
                    : "up"
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
                  (analytics?.gps?.highSpeedCount ?? 0) > 20
                    ? "warning"
                    : "normal"
                }
              />
              <FuelMetricCard
                value={analytics?.fuel?.level?.average?.toFixed(1) || "0"}
                status={
                  (analytics?.fuel?.lowFuelCount ?? 0) > 0
                    ? "warning"
                    : "normal"
                }
              />
              <EmissionsMetricCard
                value={analytics?.emissions?.co2?.average?.toFixed(1) || "0"}
                status={
                  (analytics?.emissions?.anomalies ?? 0) > 50
                    ? "critical"
                    : "warning"
                }
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ClientGrowthChart
                isLoading={isLoading}
                data={[]} // Update this to use appropriate data from dashboardData
              />
              <EmissionsChart
                isLoading={isLoading}
                data={dashboardData?.analytics?.emissions || {}}
              />
            </div>

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
                  <div></div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <MapWrapper
                  isLoading={isLoading}
                  vehicles={
                    mapData?.mapData?.map((vehicle) => ({
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
                    totalVehicles: dashboardData?.counts?.vehicles || 0,
                    activeVehicles: mapData?.vehiclesWithGpsData || 0,
                    inactiveVehicles:
                      (dashboardData?.counts?.vehicles || 0) -
                      (mapData?.vehiclesWithGpsData || 0),
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs Content */}
          {/* <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients Management</CardTitle>
                <CardDescription>
                  View and manage all client accounts
                </CardDescription>
              </CardHeader>
              <UserTable />
            </Card>
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  );
}

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
