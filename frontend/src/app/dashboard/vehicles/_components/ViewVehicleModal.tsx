"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  Car,
  User,
  Fuel,
  AlertTriangle,
  Settings,
  BarChart3,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import vehicleService from "../services";
import type { VehicleFullDetails } from "../VehicleTypes";

interface ViewVehicleModalProps {
  vehicleId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewVehicleModal({
  vehicleId,
  open,
  onOpenChange,
}: ViewVehicleModalProps) {
  const [vehicle, setVehicle] = useState<VehicleFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleId || !open) return;

      setLoading(true);
      setError(null);

      try {
        const vehicleData = await vehicleService.getVehicleById(vehicleId);
        setVehicle(vehicleData);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch vehicle details";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId, open]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL_EMISSION":
        return "bg-green-100 text-green-800";
      case "TOP_POLLUTING":
        return "bg-red-100 text-red-800";
      case "INACTIVE_DISCONNECTED":
        return "bg-gray-100 text-gray-800";
      case "UNDER_MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmissionColor = (status: string) => {
    switch (status) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "NORMAL":
        return "bg-blue-100 text-blue-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Details</DialogTitle>
          <DialogDescription>
            {vehicle
              ? `Viewing details for vehicle ${vehicle.plateNumber}`
              : "Loading vehicle details..."}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading vehicle details...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {vehicle && !loading && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="emissions">Emissions</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Basic Information
                    </span>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status.replace(/_/g, " ")}
                      </Badge>
                      <Badge
                        className={getEmissionColor(vehicle.emissionStatus)}
                      >
                        {vehicle.emissionStatus}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Plate Number
                    </p>
                    <p className="text-sm font-semibold">
                      {vehicle.plateNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Registration Number
                    </p>
                    <p className="text-sm">
                      {vehicle.registrationNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Vehicle Model
                    </p>
                    <p className="text-sm">{vehicle.vehicleModel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Vehicle Type
                    </p>
                    <p className="text-sm">{vehicle.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Year of Manufacture
                    </p>
                    <p className="text-sm">{vehicle.yearOfManufacture}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Chassis Number
                    </p>
                    <p className="text-sm">{vehicle.chassisNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Usage
                    </p>
                    <p className="text-sm">{vehicle.usage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fuel Type
                    </p>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <p className="text-sm">{vehicle.fuelType || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Owner Name
                    </p>
                    <p className="text-sm">
                      {vehicle.user?.username || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{vehicle.user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Maintenance
                    </p>
                    <p className="text-sm">
                      {formatDate(vehicle.lastMaintenanceDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created
                    </p>
                    <p className="text-sm">{formatDate(vehicle.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Status */}
              {vehicle.connectionState && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Connection Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge
                          variant={
                            vehicle.connectionState.status === "CONNECTED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {vehicle.connectionState.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Last Updated
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(vehicle.connectionState.lastUpdated)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Socket ID</span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {vehicle.connectionState.socketId.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              {/* Tracking Devices */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tracking Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.trackingDevices?.length > 0 ? (
                    <div className="space-y-4">
                      {vehicle.trackingDevices.map((device) => (
                        <div key={device.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Serial Number
                              </p>
                              <p className="text-sm">{device.serialNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Status
                              </p>
                              <Badge
                                variant={
                                  device.status === "ACTIVE"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {device.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Protocol
                              </p>
                              <p className="text-sm">
                                {device.communicationProtocol}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Firmware
                              </p>
                              <p className="text-sm">
                                {device.firmwareVersion || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No tracking devices found
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* GPS Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent GPS Data</CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.gpsData?.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {vehicle.gpsData.slice(0, 5).map((gps) => (
                        <div key={gps.id} className="border rounded-lg p-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Location
                              </p>
                              <p className="text-xs">
                                {gps.latitude.toFixed(6)},{" "}
                                {gps.longitude.toFixed(6)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Speed
                              </p>
                              <p className="text-sm">{gps.speed} km/h</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Accuracy
                              </p>
                              <p className="text-sm">
                                {gps.accuracy || "N/A"}m
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Time
                              </p>
                              <p className="text-xs">
                                {formatDate(gps.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No GPS data available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emissions" className="space-y-4">
              {/* Emission Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Emission Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.emissionData?.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {vehicle.emissionData.slice(0, 10).map((emission) => (
                        <div
                          key={emission.id}
                          className="border rounded-lg p-3"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                CO2 %
                              </p>
                              <p className="text-sm font-semibold">
                                {emission.co2Percentage}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                NOx PPM
                              </p>
                              <p className="text-sm">
                                {emission.noxPPM || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                PM2.5
                              </p>
                              <p className="text-sm">
                                {emission.pm25Level || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Time
                              </p>
                              <p className="text-xs">
                                {formatDate(emission.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No emission data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Fuel Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Fuel Data</CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.fuelData?.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {vehicle.fuelData.slice(0, 10).map((fuel) => (
                        <div key={fuel.id} className="border rounded-lg p-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Fuel Level
                              </p>
                              <p className="text-sm font-semibold">
                                {fuel.fuelLevel}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Consumption
                              </p>
                              <p className="text-sm">{fuel.fuelConsumption}L</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Time
                              </p>
                              <p className="text-xs">
                                {formatDate(fuel.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No fuel data available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.alerts?.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {vehicle.alerts.map((alert) => (
                        <div key={alert.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-sm">
                                  {alert.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {alert.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(alert.createdAt)}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={alert.isRead ? "secondary" : "default"}
                            >
                              {alert.isRead ? "Read" : "Unread"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No alerts found</p>
                  )}
                </CardContent>
              </Card>

              {/* Maintenance Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.maintenanceRecords?.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {vehicle.maintenanceRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg p-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {record.type}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(record.performedAt)}
                              </span>
                            </div>
                            {record.description && (
                              <p className="text-sm text-muted-foreground">
                                {record.description}
                              </p>
                            )}
                            {record.recommendedAction && (
                              <p className="text-sm">
                                <strong>Recommended:</strong>{" "}
                                {record.recommendedAction}
                              </p>
                            )}
                            {record.nextDueDate && (
                              <p className="text-sm">
                                <strong>Next Due:</strong>{" "}
                                {formatDate(record.nextDueDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No maintenance records found
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
