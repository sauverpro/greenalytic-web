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
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle, Battery, Signal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getTrackingDeviceById,
  getDeviceHealth,
  getMonitoringFeatures,
} from "@/services/trackingDeviceService";
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes";

interface ViewDeviceModalProps {
  deviceId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDeviceModal({
  deviceId,
  open,
  onOpenChange,
}: ViewDeviceModalProps) {
  const [device, setDevice] = useState<TrackingDeviceListItem | null>(null);
  const [deviceHealth, setDeviceHealth] = useState<any | null>(null);
  const [monitoringFeatures, setMonitoringFeatures] = useState<any | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchDeviceData = async () => {
      if (!deviceId || !open) return;

      setLoading(true);
      setError(null);

      try {
        const [deviceData, healthData, featuresData] = await Promise.all([
          getTrackingDeviceById(deviceId),
          getDeviceHealth(deviceId, 24),
          getMonitoringFeatures(deviceId),
        ]);

        setDevice(deviceData);
        setDeviceHealth(healthData);
        setMonitoringFeatures(featuresData);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch device details";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [deviceId, open]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "INACTIVE":
        return "text-yellow-600";
      case "DISCONNECTED":
        return "text-red-600";
      case "MAINTENANCE":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "DISCONNECTED":
        return "destructive";
      case "MAINTENANCE":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Device Details</DialogTitle>
          <DialogDescription>
            {device
              ? `Viewing details for device ${device.serialNumber}`
              : "Loading device details..."}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading device details...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {device && !loading && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Basic Information</span>
                    <Badge variant={getStatusVariant(device.status)}>
                      {device.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Serial Number
                    </p>
                    <p className="text-sm">{device.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Model
                    </p>
                    <p className="text-sm">{device.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Type
                    </p>
                    <p className="text-sm">{device.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Category
                    </p>
                    <p className="text-sm">{device.deviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Plate Number
                    </p>
                    <p className="text-sm">{device.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Firmware Version
                    </p>
                    <p className="text-sm">{device.firmwareVersion || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Technical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Communication Protocol
                    </p>
                    <p className="text-sm">{device.communicationProtocol}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Data Transmission Interval
                    </p>
                    <p className="text-sm">{device.dataTransmissionInterval}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      SIM Card Number
                    </p>
                    <p className="text-sm">{device.simCardNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Installation Date
                    </p>
                    <p className="text-sm">
                      {formatDate(device.installationDate)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Assignment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Assigned User
                    </p>
                    <p className="text-sm">
                      {device.user
                        ? `${device.user.username} (${device.user.email})`
                        : "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Assigned Vehicle
                    </p>
                    <p className="text-sm">
                      {device.vehicle
                        ? `${device.vehicle.plateNumber} (${device.vehicle.vehicleType})`
                        : "Not assigned"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              {/* Monitoring Features Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monitoring Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {monitoringFeatures ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            device.enableGPSTracking
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <p className="text-sm">GPS Tracking</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            device.enableOBDMonitoring
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <p className="text-sm">OBD Monitoring</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            device.enableEmissionMonitoring
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <p className="text-sm">Emission Monitoring</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            device.enableFuelMonitoring
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <p className="text-sm">Fuel Monitoring</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No monitoring features data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Last Data Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Last Data Received</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Last Ping:</span>{" "}
                      {formatDate(device.lastPing)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Battery
                          className={`h-4 w-4 ${
                            device.batteryLevel > 60
                              ? "text-green-600"
                              : device.batteryLevel > 30
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        />
                        <span className="text-sm">{device.batteryLevel}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Signal
                          className={`h-4 w-4 ${
                            device.signalStrength > 70
                              ? "text-green-600"
                              : device.signalStrength > 40
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        />
                        <span className="text-sm">
                          {device.signalStrength}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              {/* Health Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {deviceHealth ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Uptime Percentage:
                        </span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                deviceHealth.uptimePercentage > 80
                                  ? "bg-green-500"
                                  : deviceHealth.uptimePercentage > 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${deviceHealth.uptimePercentage}%`,
                              }}
                            />
                          </div>
                          <span className="ml-2 text-sm">
                            {deviceHealth.uptimePercentage}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Current Status:
                        </span>
                        <Badge
                          variant={
                            deviceHealth.currentStatus === "CONNECTED"
                              ? "default"
                              : deviceHealth.currentStatus === "DISCONNECTED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {deviceHealth.currentStatus}
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">
                          Recent Heartbeats
                        </h4>
                        {deviceHealth.heartbeats &&
                        deviceHealth.heartbeats.length > 0 ? (
                          <div className="max-h-40 overflow-y-auto">
                            {deviceHealth.heartbeats
                              .slice(0, 5)
                              .map((heartbeat: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-1 text-sm"
                                >
                                  <span
                                    className={
                                      heartbeat.status === "CONNECTED"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {heartbeat.status}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {new Date(
                                      heartbeat.timestamp
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No recent heartbeats recorded
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No health data available
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
