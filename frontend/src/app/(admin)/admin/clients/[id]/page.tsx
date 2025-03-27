"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Download,
  Edit,
  Fuel,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Router,
  Trash,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define TypeScript interfaces for client data
interface ClientDevice {
  gps: number;
  fuel: number;
  emissions: number;
}

interface ClientBillingInfo {
  plan: string;
  nextBilling: string;
  amount: string;
  paymentMethod: string;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  joinDate: string;
  subscription: string;
  vehicles: number;
  devices: ClientDevice;
  contactPerson: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  billingInfo: ClientBillingInfo;
}

interface VehicleData {
  id: string;
  plate: string;
  model: string;
  year: string;
  status: string;
  devices: string[];
}

interface DeviceData {
  id: string;
  type: string;
  vehicle: string;
  date: string;
  status: string;
  lastPing: string;
}

export default function ClientDetails() {
  const [selectedTab, setSelectedTab] = useState("vehicles");

  // Mock client data
  const client: ClientData = {
    id: "CL-1234",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Corporate Park, CA 94103",
    status: "active",
    joinDate: "Jan 15, 2023",
    subscription: "Enterprise",
    vehicles: 12,
    devices: {
      gps: 12,
      fuel: 10,
      emissions: 8,
    },
    contactPerson: "John Smith",
    contactRole: "Fleet Manager",
    contactEmail: "john.smith@acmecorp.com",
    contactPhone: "+1 (555) 987-6543",
    billingInfo: {
      plan: "Annual Enterprise",
      nextBilling: "Dec 31, 2023",
      amount: "$12,000",
      paymentMethod: "Credit Card (ending in 4567)",
    },
  };

  // Mock vehicles data
  const vehicles: VehicleData[] = [
    {
      id: "V-001",
      plate: "ABC123",
      model: "Toyota Prius",
      year: "2022",
      status: "active",
      devices: ["GPS", "Fuel", "Emissions"],
    },
    {
      id: "V-002",
      plate: "XYZ789",
      model: "Tesla Model 3",
      year: "2023",
      status: "active",
      devices: ["GPS", "Emissions"],
    },
    {
      id: "V-003",
      plate: "DEF456",
      model: "Ford F-150",
      year: "2021",
      status: "maintenance",
      devices: ["GPS", "Fuel"],
    },
    {
      id: "V-004",
      plate: "GHI789",
      model: "Honda Civic",
      year: "2022",
      status: "active",
      devices: ["GPS", "Fuel", "Emissions"],
    },
    {
      id: "V-005",
      plate: "JKL012",
      model: "Chevrolet Bolt",
      year: "2023",
      status: "inactive",
      devices: ["GPS"],
    },
  ];

  // Mock devices data
  const devices: DeviceData[] = [
    {
      id: "D-001",
      type: "GPS Tracker",
      vehicle: "ABC123",
      date: "Jan 15, 2023",
      status: "online",
      lastPing: "2 mins ago",
    },
    {
      id: "D-002",
      type: "Fuel Sensor",
      vehicle: "ABC123",
      date: "Jan 15, 2023",
      status: "online",
      lastPing: "5 mins ago",
    },
    {
      id: "D-003",
      type: "Emissions Monitor",
      vehicle: "ABC123",
      date: "Jan 15, 2023",
      status: "online",
      lastPing: "3 mins ago",
    },
    {
      id: "D-004",
      type: "GPS Tracker",
      vehicle: "XYZ789",
      date: "Feb 20, 2023",
      status: "online",
      lastPing: "1 min ago",
    },
    {
      id: "D-005",
      type: "Emissions Monitor",
      vehicle: "XYZ789",
      date: "Feb 20, 2023",
      status: "offline",
      lastPing: "2 days ago",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold text-emerald-800">
            Client Details
          </h1>
          <Badge
            variant="outline"
            className="ml-2 bg-emerald-100 text-emerald-800 border-emerald-200"
          >
            {client.id}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Client Overview */}
        <div className="mb-6 grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
                    {client.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{client.name}</h3>
                <Badge
                  className={
                    client.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {client.status.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Client since {client.joinDate}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{client.address}</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Subscription</h4>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {client.subscription}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Vehicles
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <Car className="h-5 w-5 text-emerald-700" />
                    </div>
                    <span className="text-2xl font-bold">
                      {client.vehicles}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    GPS Trackers
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2">
                      <MapPin className="h-5 w-5 text-blue-700" />
                    </div>
                    <span className="text-2xl font-bold">
                      {client.devices.gps}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Fuel Sensors
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-100 p-2">
                      <Fuel className="h-5 w-5 text-amber-700" />
                    </div>
                    <span className="text-2xl font-bold">
                      {client.devices.fuel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Primary Contact</h4>
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {client.contactPerson
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.contactPerson}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.contactRole}
                    </p>
                  </div>
                  <div className="ml-auto flex flex-col text-sm">
                    <span>{client.contactEmail}</span>
                    <span>{client.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">
                  Billing Information
                </h4>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Plan:</span>
                    <span className="text-sm font-medium">
                      {client.billingInfo.plan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Next Billing:
                    </span>
                    <span className="text-sm font-medium">
                      {client.billingInfo.nextBilling}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount:
                    </span>
                    <span className="text-sm font-medium">
                      {client.billingInfo.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Method:
                    </span>
                    <span className="text-sm font-medium">
                      {client.billingInfo.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Client Data */}
        <Tabs
          defaultValue="vehicles"
          className="space-y-6"
          onValueChange={setSelectedTab}
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="support">Support Tickets</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Client Vehicles</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left">
                        <th className="p-4 font-medium">Vehicle ID</th>
                        <th className="p-4 font-medium">Plate Number</th>
                        <th className="p-4 font-medium">Model</th>
                        <th className="p-4 font-medium">Year</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Devices</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4">{vehicle.id}</td>
                          <td className="p-4 font-medium">{vehicle.plate}</td>
                          <td className="p-4">{vehicle.model}</td>
                          <td className="p-4">{vehicle.year}</td>
                          <td className="p-4">
                            <Badge
                              className={
                                vehicle.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : vehicle.status === "maintenance"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {vehicle.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              {vehicle.devices.includes("GPS") && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 border-blue-200"
                                >
                                  <MapPin className="mr-1 h-3 w-3" />
                                  GPS
                                </Badge>
                              )}
                              {vehicle.devices.includes("Fuel") && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 border-amber-200"
                                >
                                  <Fuel className="mr-1 h-3 w-3" />
                                  Fuel
                                </Badge>
                              )}
                              {vehicle.devices.includes("Emissions") && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 border-green-200"
                                >
                                  <Router className="mr-1 h-3 w-3" />
                                  Emissions
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Edit Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Manage Devices
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remove Vehicle
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                <div className="text-sm text-muted-foreground">
                  Showing {vehicles.length} of {client.vehicles} vehicles
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Client Devices</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left">
                        <th className="p-4 font-medium">Device ID</th>
                        <th className="p-4 font-medium">Type</th>
                        <th className="p-4 font-medium">Vehicle</th>
                        <th className="p-4 font-medium">Installation Date</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Last Ping</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4">{device.id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {device.type === "GPS Tracker" && (
                                <MapPin className="h-4 w-4 text-blue-500" />
                              )}
                              {device.type === "Fuel Sensor" && (
                                <Fuel className="h-4 w-4 text-amber-500" />
                              )}
                              {device.type === "Emissions Monitor" && (
                                <Router className="h-4 w-4 text-green-500" />
                              )}
                              <span>{device.type}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium">{device.vehicle}</td>
                          <td className="p-4">{device.date}</td>
                          <td className="p-4">
                            <Badge
                              className={
                                device.status === "online"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {device.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {device.lastPing}
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Device</DropdownMenuItem>
                                <DropdownMenuItem>
                                  Reassign Device
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remove Device
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                <div className="text-sm text-muted-foreground">
                  Showing {devices.length} of{" "}
                  {client.devices.gps +
                    client.devices.fuel +
                    client.devices.emissions}{" "}
                  devices
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage & Analytics</CardTitle>
                <CardDescription>
                  Client usage patterns and analytics data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Usage analytics charts and data would appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Client payment and invoice history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Billing history and invoices would appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  Client support requests and history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Support tickets and history would appear here
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
