"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddDeviceModal } from "@/components/adminComponents/add-device-modal";
import { ClientData, DeviceData, User, VehicleData } from "@/types/types";
import { getUserById } from "@/services/userService";
import { CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Card, CardHeader, CardContent } from "@mui/material";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Mail,
  Edit,
  Download,
  Phone,
  MapPin,
  Car,
  Fuel,
  Plus,
  Router,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { getVehiclesForUser } from "@/services/vehicleService";
import { VehicleTable } from "./TableData";
import EditUserDrawer from "../EditUserDrawer";

export default function ClientDetails() {
  const params = useParams();
  const rawUserId = params?.userId || params?.id;
  const userId = Array.isArray(rawUserId)
    ? rawUserId[0]
    : (rawUserId as string);

  const [selectedTab, setSelectedTab] = useState("vehicles");
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isEditUserDrawerOpen, setIsEditUserDrawerOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

    
  const fetchClientData = async () => {
    if (!userId) {
      console.log("No userId found in params");
      return;
    }

    setLoading(true);
    console.log("Fetching client data for userId:", userId);

    try {
      const clientData = await getUserById(userId);

        
      setUserData(clientData.user);

      setClient({
        id: clientData.user.id.toString(),
        name: clientData.user.username,
        email: clientData.user.email,
        phone: clientData.user.phoneNumber,
        status: clientData.user.verified ? "active" : "pending",
        image: clientData.user.image,
        totalGPS: clientData.user.totalGpsData,
        totalFuel: clientData.user.totalFuelData,
        totalEmissions: clientData.user.totalEmissions,
        joinDate: new Date(clientData.user.createdAt).toLocaleDateString(),
        subscription: "Standard",
        vehicles: clientData.user.vehicles.length,
        GPSDevices: clientData.user.deviceCounts.gps,
        fuelDevices: clientData.user.deviceCounts.fuel,
        emissionsDevices: clientData.user.deviceCounts.emissions,
        totalDevices: clientData.user.deviceCounts.total,
        billingInfo: {
          plan: "Standard Plan",
          nextBilling: "N/A",
          amount: "$0.00",
          paymentMethod: "Credit Card",
        },
        address: clientData.user.address || "N/A",
        devices: clientData.user.devices || [],
        contactPerson: clientData.user.contactPerson || "N/A",
        contactRole: clientData.user.contactRole || "N/A",
        contactEmail: clientData.user.contactEmail || "N/A",
        contactPhone: clientData.user.contactPhone || "N/A",
      });

      const extractedDevices: DeviceData[] =
        clientData.user.trackingDevices.map((device: any) => ({
          id: device.id.toString(),
          type: `${
            device.type.charAt(0).toUpperCase() +
            device.type.slice(1).toLowerCase()
          } Tracker`,
          vehicle: "Unassigned",
          date: new Date(device.createdAt || "2023-01-01").toLocaleDateString(),
          status: device.isActive ? "online" : "offline",
          lastPing: "N/A",
        }));
      setDevices(extractedDevices);

      const fetchedVehicles = await getVehiclesForUser(userId);
      console.log(
        "Fetched vehicles data:::::::::::::::: ",
        fetchedVehicles.vehicles
      );

      setVehicles(
        Array.isArray(fetchedVehicles.vehicles) ? fetchedVehicles.vehicles : []
      );
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast("Error fetching client data");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [userId]);

  const handleDeviceAdded = () => {
    toast("The device has been successfully added to the vehicle.");
    fetchClientData();   
  };

  const handleVehicleAdded = () => {
    toast("The vehicle has been successfully added to this client.");
    fetchClientData();   
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-2">Client Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested client could not be found.
        </p>
        <Button asChild>
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
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
            {userId}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditUserDrawerOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit user
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
                  {client?.image ? (
                    <img src={client.image} />
                  ) : (
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
                      {client?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="text-xl font-bold">{client?.name}</h3>
                <Badge
                  className={
                    client?.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-sms"
                  }
                >
                  {client?.status.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {/* Client since {client?.joinDate} */}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client?.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{client?.address}</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Subscription</h4>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {client?.subscription}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Account Summary */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-muted-foreground">
                    Vehicles
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-100 p-3">
                      <Car className="h-10 w-10 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold">
                        {client?.vehicles}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Total vehicles
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-muted-foreground">
                    Tracking Devices
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-full bg-blue-100 p-2">
                          <MapPin className="h-5 w-5 text-blue-700" />
                        </div>
                        <h5 className="font-medium">GPS Trackers</h5>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">
                            {client?.GPSDevices}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Devices
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-medium text-blue-600">
                            {client?.totalGPS}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Data points
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-full bg-amber-100 p-2">
                          <Fuel className="h-5 w-5 text-amber-700" />
                        </div>
                        <h5 className="font-medium">Fuel Sensors</h5>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">
                            {client?.fuelDevices}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Devices
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-medium text-amber-600">
                            {client?.totalFuel}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Data points
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Emission Sensors */}
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-full bg-green-100 p-2">
                          <Router className="h-5 w-5 text-green-700" />
                        </div>
                        <h5 className="font-medium">Emission Sensors</h5>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">
                            {client?.emissionsDevices}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Devices
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-medium text-green-600">
                            {client?.totalEmissions}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Data points
                          </span>
                        </div>
                      </div>
                    </div>
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
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <VehicleTable
              userId={userId}
              onAddVehicle={() => setIsAddVehicleModalOpen(true)}
              onAddDevice={(vehicleId) => {
                setSelectedVehicleId(vehicleId.toString());
                setIsAddDeviceModalOpen(true);
              }}
            />
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Client Devices</h2>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                    
                  if (vehicles.length === 0) {
                    toast("Please add a vehicle first before adding devices.");
                  }
                    
                    
                  setIsAddDeviceModalOpen(true);
                }}
              >
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
                                  : "bg-gray-100 text-sms"
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
                  {parseInt(String(client?.GPSDevices ?? 0)) +
                    parseInt(String(client?.fuelDevices ?? 0)) +
                    parseInt(String(client?.emissionsDevices ?? 0))}
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
        </Tabs>
      </main>

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        vehicleId={selectedVehicleId || ""}
        availableVehicles={
          Array.isArray(vehicles)
            ? vehicles.map((v) => ({
                id: v.id?.toString() || "",
                plate: v.plateNumber || "",
              }))
            : []
        }
      />
      <EditUserDrawer
        open={isEditUserDrawerOpen}
        onOpenChange={setIsEditUserDrawerOpen}
        user={userData}
        refetchUsers={fetchClientData}
      />
    </div>
  );
}
