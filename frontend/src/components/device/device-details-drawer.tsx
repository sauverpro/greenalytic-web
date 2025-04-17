"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { viewDevice } from "@/services/deviceServices";
import type { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Car,
  Fuel,
  MapPin,
  Router,
  User,
  Calendar,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerWithRange } from "./date-range-picker";

 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DeviceDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
}

interface DeviceData {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  isActive: boolean;
  status: string;
  lastPing: string;
  userId: number;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  vehicle: {
    id: number;
    plateNumber: string;
    chassisNumber: string;
    vehicleType: string;
    vehicleModel: string;
    yearOfManufacture: number;
    usage: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    image: string;
  };
}

interface EmissionData {
  id: number;
  timestamp: string;
  co2Percentage: number;
  coPercentage: number;
  o2Percentage: number;
  hcPPM: number;
  vehicleId: number;
  plateNumber: string;
  trackingDeviceId: number;
  createdAt: string;
}

interface GPSData {
  id: number;
  latitude: number;
  longitude: number;
  plateNumber: string;
  speed: number;
  accuracy: number | null;
  timestamp: string;
  vehicleId: number;
  trackingStatus: boolean;
  trackingDeviceId: number;
  createdAt: string;
  updatedAt: string;
}

interface FuelData {
  id: number;
  timestamp: string;
  fuelLevel: number;
  fuelConsumption: number;
  plateNumber: string;
  trackingDeviceId: number;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
}

interface DeviceResponse {
  success: boolean;
  message: string;
  data: DeviceData;
  deviceData: {
    emissionData?: EmissionData[];
    gpsData?: GPSData[];
    fuelData?: FuelData[];
  };
  pagination: {
    emissionData?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      skip: number;
    };
    gpsData?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      skip: number;
    };
    fuelData?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      skip: number;
    };
  };
}

export function DeviceDetailsDrawer({
  open,
  onOpenChange,
  deviceId,
}: DeviceDetailsDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [deviceDetails, setDeviceDetails] = useState<DeviceResponse | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (open && deviceId) {
      fetchDeviceDetails();
    }
  }, [open, deviceId, currentPage, limit, dateRange]);

  const fetchDeviceDetails = async () => {
    if (!deviceId) return;

    setLoading(true);
    try {
       
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      if (dateRange?.from) {
        params.append("startDate", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("endDate", dateRange.to.toISOString());
      }

       
      const response = await viewDevice(deviceId);
      setDeviceDetails(response);
    } catch (error) {
      console.error("Error fetching device details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case "EMISSION":
        return <Router className="h-5 w-5 text-green-600" />;
      case "GPS":
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case "FUEL":
        return <Fuel className="h-5 w-5 text-amber-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case "EMISSION":
        return "bg-green-100 text-green-800 border-green-200";
      case "GPS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FUEL":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getHeaderGradient = (type: string) => {
    switch (type) {
      case "EMISSION":
        return "from-green-600 to-green-800";
      case "GPS":
        return "from-blue-600 to-blue-800";
      case "FUEL":
        return "from-amber-600 to-amber-800";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  const getChartData = () => {
    if (!deviceDetails) return null;

    const { deviceData, data } = deviceDetails;
    const labels: string[] = [];
    let datasets: any[] = [];

    if (data.type === "EMISSION" && deviceData.emissionData) {
      labels.push(
        ...deviceData.emissionData.map((item) =>
          format(new Date(item.timestamp), "MMM dd, HH:mm")
        )
      );

      datasets = [
        {
          label: "CO2 Percentage",
          data: deviceData.emissionData.map((item) => item.co2Percentage),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.5)",
        },
        {
          label: "CO Percentage",
          data: deviceData.emissionData.map((item) => item.coPercentage),
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
        },
        {
          label: "O2 Percentage",
          data: deviceData.emissionData.map((item) => item.o2Percentage),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
      ];
    } else if (data.type === "GPS" && deviceData.gpsData) {
      labels.push(
        ...deviceData.gpsData.map((item) =>
          format(new Date(item.timestamp), "MMM dd, HH:mm")
        )
      );

      datasets = [
        {
          label: "Speed (km/h)",
          data: deviceData.gpsData.map((item) => item.speed),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
      ];
    } else if (data.type === "FUEL" && deviceData.fuelData) {
      labels.push(
        ...deviceData.fuelData.map((item) =>
          format(new Date(item.timestamp), "MMM dd, HH:mm")
        )
      );

      datasets = [
        {
          label: "Fuel Level (%)",
          data: deviceData.fuelData.map((item) => item.fuelLevel),
          borderColor: "rgb(245, 158, 11)",
          backgroundColor: "rgba(245, 158, 11, 0.5)",
        },
        {
          label: "Fuel Consumption",
          data: deviceData.fuelData.map((item) => item.fuelConsumption),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.5)",
        },
      ];
    }

    return {
      labels,
      datasets,
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          deviceDetails?.data.type === "EMISSION"
            ? "Emission Data Over Time"
            : deviceDetails?.data.type === "GPS"
            ? "Speed Data Over Time"
            : "Fuel Data Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderDeviceDataTable = () => {
    if (!deviceDetails) return null;

    const { deviceData, data, pagination } = deviceDetails;

    if (data.type === "EMISSION" && deviceData.emissionData) {
      return (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>CO2 (%)</TableHead>
                  <TableHead>CO (%)</TableHead>
                  <TableHead>O2 (%)</TableHead>
                  <TableHead>HC (PPM)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deviceData.emissionData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(
                        new Date(item.timestamp),
                        "MMM dd, yyyy HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell>{item.co2Percentage.toFixed(2)}</TableCell>
                    <TableCell>{item.coPercentage.toFixed(2)}</TableCell>
                    <TableCell>{item.o2Percentage.toFixed(2)}</TableCell>
                    <TableCell>{item.hcPPM}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {renderPagination(pagination.emissionData)}
        </>
      );
    } else if (data.type === "GPS" && deviceData.gpsData) {
      return (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Speed (km/h)</TableHead>
                  <TableHead>Tracking Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deviceData.gpsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(
                        new Date(item.timestamp),
                        "MMM dd, yyyy HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell>{item.latitude.toFixed(6)}</TableCell>
                    <TableCell>{item.longitude.toFixed(6)}</TableCell>
                    <TableCell>{item.speed.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.trackingStatus ? "default" : "secondary"}
                      >
                        {item.trackingStatus ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {renderPagination(pagination.gpsData)}
        </>
      );
    } else if (data.type === "FUEL" && deviceData.fuelData) {
      return (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Fuel Level (%)</TableHead>
                  <TableHead>Fuel Consumption</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deviceData.fuelData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(
                        new Date(item.timestamp),
                        "MMM dd, yyyy HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell>{item.fuelLevel.toFixed(2)}</TableCell>
                    <TableCell>{item.fuelConsumption.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {renderPagination(pagination.fuelData)}
        </>
      );
    }

    return <p>No data available</p>;
  };

  const renderPagination = (paginationData: any) => {
    if (!paginationData) return null;

    const { total, page, limit, pages } = paginationData;

    return (
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(limit, total - (page - 1) * limit)} of {total}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {pages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page + 1)}
            disabled={page >= pages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    );
  };

  const chartData = getChartData();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full h-full flex flex-col bg-white border-l border-gray-200 shadow-lg">
        {loading ? (
          <>
            <DrawerHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white flex justify-between items-center p-4">
              <div className="flex items-center gap-3">
                <DrawerTitle className="text-xl font-bold">
                  <Skeleton className="h-8 w-40 bg-gray-700" />
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
              <Skeleton className="h-64" />
            </div>
          </>
        ) : deviceDetails ? (
          <>
            <DrawerHeader
              className={`bg-gradient-to-r ${getHeaderGradient(
                deviceDetails.data.type
              )} text-white flex justify-between items-center p-4`}
            >
              <div className="flex items-center gap-3">
                <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                  {getDeviceTypeIcon(deviceDetails.data.type)}
                  {deviceDetails.data.model} Details
                </DrawerTitle>
                <Badge variant="outline" className="text-white border-white">
                  ID: {deviceDetails.data.id}
                </Badge>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-opacity-20 hover:bg-white"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </DrawerHeader>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {getDeviceTypeIcon(deviceDetails.data.type)}
                    <span>{deviceDetails.data.serialNumber}</span>
                    <Badge
                      variant="outline"
                      className={getDeviceTypeColor(deviceDetails.data.type)}
                    >
                      {deviceDetails.data.type}
                    </Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Last Updated:{" "}
                    {format(
                      new Date(deviceDetails.data.lastPing),
                      "MMM dd, yyyy HH:mm:ss"
                    )}
                  </p>
                </div>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                  className="w-full md:w-auto"
                />
              </div>

              <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="data">Device Data</TabsTrigger>
                  <TabsTrigger value="chart">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          Device Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Device ID:
                            </dt>
                            <dd>{deviceDetails.data.id}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Serial Number:
                            </dt>
                            <dd>{deviceDetails.data.serialNumber}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Model:
                            </dt>
                            <dd>{deviceDetails.data.model}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Type:
                            </dt>
                            <dd>
                              <Badge
                                className={getDeviceTypeColor(
                                  deviceDetails.data.type
                                )}
                              >
                                {deviceDetails.data.type}
                              </Badge>
                            </dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Status:
                            </dt>
                            <dd>
                              <Badge
                                variant={
                                  deviceDetails.data.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {deviceDetails.data.status}
                              </Badge>
                            </dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Last Ping:
                            </dt>
                            <dd>
                              {format(
                                new Date(deviceDetails.data.lastPing),
                                "MMM dd, yyyy HH:mm:ss"
                              )}
                            </dd>
                          </div>
                          <div className="flex justify-between py-1">
                            <dt className="font-medium text-muted-foreground">
                              Created At:
                            </dt>
                            <dd>
                              {format(
                                new Date(deviceDetails.data.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          Vehicle Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Vehicle ID:
                            </dt>
                            <dd>{deviceDetails.data.vehicle.id}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Plate Number:
                            </dt>
                            <dd>{deviceDetails.data.vehicle.plateNumber}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Chassis Number:
                            </dt>
                            <dd>{deviceDetails.data.vehicle.chassisNumber}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Vehicle Type:
                            </dt>
                            <dd>{deviceDetails.data.vehicle.vehicleType}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Model:
                            </dt>
                            <dd>{deviceDetails.data.vehicle.vehicleModel}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <dt className="font-medium text-muted-foreground">
                              Year:
                            </dt>
                            <dd>
                              {deviceDetails.data.vehicle.yearOfManufacture}
                            </dd>
                          </div>
                          <div className="flex justify-between py-1">
                            <dt className="font-medium text-muted-foreground">
                              Usage:
                            </dt>
                            <dd>{deviceDetails.data.vehicle.usage}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Owner Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={
                              deviceDetails.data.user.image ||
                              "/placeholder.svg"
                            }
                            alt={deviceDetails.data.user.username}
                          />
                          <AvatarFallback>
                            {deviceDetails.data.user.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {deviceDetails.data.user.username}
                          </h3>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{deviceDetails.data.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{deviceDetails.data.user.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {deviceDetails.data.user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {deviceDetails.data.type === "EMISSION"
                          ? "Emission Data"
                          : deviceDetails.data.type === "GPS"
                          ? "GPS Data"
                          : "Fuel Data"}
                      </CardTitle>
                      <CardDescription>
                        Showing data for the selected date range
                      </CardDescription>
                    </CardHeader>
                    <CardContent>{renderDeviceDataTable()}</CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="chart" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Data Visualization
                      </CardTitle>
                      <CardDescription>
                        Graphical representation of device data over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartData ? (
                        <div className="h-[400px]">
                          <Line data={chartData} options={chartOptions} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[400px]">
                          <p className="text-muted-foreground">
                            No data available for visualization
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t bg-gray-50 mt-auto">
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className={`bg-white border-${
                      deviceDetails.data.type === "EMISSION"
                        ? "green"
                        : deviceDetails.data.type === "GPS"
                        ? "blue"
                        : "amber"
                    }-200 text-${
                      deviceDetails.data.type === "EMISSION"
                        ? "green"
                        : deviceDetails.data.type === "GPS"
                        ? "blue"
                        : "amber"
                    }-600 hover:bg-${
                      deviceDetails.data.type === "EMISSION"
                        ? "green"
                        : deviceDetails.data.type === "GPS"
                        ? "blue"
                        : "amber"
                    }-50`}
                  >
                    Edit Device
                  </Button>
                  <Button
                    className={`bg-${
                      deviceDetails.data.type === "EMISSION"
                        ? "green"
                        : deviceDetails.data.type === "GPS"
                        ? "blue"
                        : "amber"
                    }-600 hover:bg-${
                      deviceDetails.data.type === "EMISSION"
                        ? "green"
                        : deviceDetails.data.type === "GPS"
                        ? "blue"
                        : "amber"
                    }-700`}
                  >
                    Download Data
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DrawerHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white flex justify-between items-center p-4">
              <div className="flex items-center gap-3">
                <DrawerTitle className="text-xl font-bold">
                  Device Details
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="flex flex-col items-center justify-center py-12 flex-1">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Device Not Found</h3>
              <p className="text-muted-foreground text-center">
                The requested device information could not be loaded.
              </p>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
