"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Edit,
  Settings,
  Activity,
  Battery,
  Signal,
  MapPin,
  Car,
  Gauge,
  Fuel,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
  User,
  Smartphone,
  Wifi,
  Calendar,
  CheckCircle,
  Circle,
  BarChart3,
  History,
  Heart,
} from "lucide-react"
import {
  getTrackingDeviceById,
  getDeviceHealth,
  getMonitoringFeatures,
  getDeviceStatusHistory,
} from "@/services/trackingDeviceService"

import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes"
import { toast } from "sonner"
import { UpdateAndAddDeviceSheet } from "../_DeviceComponents/UpdateAndAddDevice"
import { DeleteDeviceDialog } from "../_DeviceComponents/DeleteDeviceDialog"
import { DeviceStatusSheet } from "../_DeviceComponents/DeviceStatusSheet"
import { MonitoringFeaturesDialog } from "../_DeviceComponents/monitoring-features-dialog"

export default function DeviceDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const deviceId = Number.parseInt(params.deviceId as string)

  const [device, setDevice] = useState<TrackingDeviceListItem | null>(null)
  const [deviceHealth, setDeviceHealth] = useState<any | null>(null)
  const [monitoringFeatures, setMonitoringFeatures] = useState<any | null>(null)
  const [statusHistory, setStatusHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [monitoringDialogOpen, setMonitoringDialogOpen] = useState(false)

  const fetchDeviceData = async () => {
    if (!deviceId) return

    setLoading(true)
    setError(null)
    try {
      const [deviceData, healthData, featuresData, historyData] = await Promise.all([
        getTrackingDeviceById(deviceId),
        getDeviceHealth(deviceId, 24).catch(() => null),
        getMonitoringFeatures(deviceId).catch(() => null),
        getDeviceStatusHistory(deviceId, 30).catch(() => []),
      ])

      setDevice(deviceData)
      setDeviceHealth(healthData)
      setMonitoringFeatures(featuresData)
      setStatusHistory(historyData)
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to fetch device details"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeviceData()
  }, [deviceId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600"
      case "INACTIVE":
        return "text-yellow-600"
      case "DISCONNECTED":
        return "text-red-600"
      case "MAINTENANCE":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "INACTIVE":
        return "secondary"
      case "DISCONNECTED":
        return "destructive"
      case "MAINTENANCE":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-600"
    if (level > 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getSignalColor = (strength: number) => {
    if (strength > 70) return "text-green-600"
    if (strength > 40) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const renderMonitoringFeatures = () => {
    if (!device) return null

    const features = [
      { key: "GPS", label: "GPS Tracking", enabled: device.enableGPSTracking, icon: MapPin },
      { key: "OBD", label: "OBD Monitoring", enabled: device.enableOBDMonitoring, icon: Car },
      { key: "Emission", label: "Emission Monitoring", enabled: device.enableEmissionMonitoring, icon: Gauge },
      { key: "Fuel", label: "Fuel Monitoring", enabled: device.enableFuelMonitoring, icon: Fuel },
    ]

    return (
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.key}
              className={`flex items-center gap-3 p-4 rounded-lg border ${
                feature.enabled ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <Icon className={`h-5 w-5 ${feature.enabled ? "text-green-600" : "text-gray-400"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">{feature.label}</p>
                <p className={`text-xs ${feature.enabled ? "text-green-600" : "text-gray-500"}`}>
                  {feature.enabled ? "Enabled" : "Disabled"}
                </p>
              </div>
              {feature.enabled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading device details...</span>
        </div>
      </div>
    )
  }

  if (error || !device) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Device not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{device.serialNumber}</h1>
            <p className="text-muted-foreground">
              {device.model} • {device.plateNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(device.status)} className="text-sm">
            {device.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStatusDialogOpen(true)} className="gap-2">
            <Activity className="h-4 w-4" />
            Status
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMonitoringDialogOpen(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            Monitoring
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
              <div>
                <p className="text-sm font-medium">Battery</p>
                <p className={`text-lg font-bold ${getBatteryColor(device.batteryLevel)}`}>{device.batteryLevel}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Signal className={`h-4 w-4 ${getSignalColor(device.signalStrength)}`} />
              <div>
                <p className="text-sm font-medium">Signal</p>
                <p className={`text-lg font-bold ${getSignalColor(device.signalStrength)}`}>{device.signalStrength}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Ping</p>
                <p className="text-sm text-muted-foreground">
                  {device.lastPing ? new Date(device.lastPing).toLocaleString() : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-lg font-bold">{deviceHealth?.uptimePercentage || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                    <p className="text-sm">{device.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <p className="text-sm">{device.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="text-sm">{device.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-sm">{device.deviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plate Number</p>
                    <p className="text-sm">{device.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Firmware</p>
                    <p className="text-sm">{device.firmwareVersion || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Technical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Protocol</p>
                    <p className="text-sm">{device.communicationProtocol}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transmission Interval</p>
                    <p className="text-sm">{device.dataTransmissionInterval}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SIM Card</p>
                    <p className="text-sm">{device.simCardNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installation Date</p>
                    <p className="text-sm">{formatDate(device.installationDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assignment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned User</p>
                  <p className="text-sm">
                    {device.user ? `${device.user.username} (${device.user.email})` : "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Vehicle</p>
                  <p className="text-sm">
                    {device.vehicle ? `${device.vehicle.plateNumber} (${device.vehicle.vehicleType})` : "Not assigned"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timestamps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-sm">{formatDate(device.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                  <p className="text-sm">{formatDate(device.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Ping</p>
                  <p className="text-sm">{formatDate(device.lastPing)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Monitoring Features
                </span>
                <Button variant="outline" size="sm" onClick={() => setMonitoringDialogOpen(true)} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>{renderMonitoringFeatures()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Device Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deviceHealth ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Uptime Percentage:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            deviceHealth.uptimePercentage > 80
                              ? "bg-green-500"
                              : deviceHealth.uptimePercentage > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${deviceHealth.uptimePercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{deviceHealth.uptimePercentage}%</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Recent Heartbeats</h4>
                    {deviceHealth.heartbeats && deviceHealth.heartbeats.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {deviceHealth.heartbeats.slice(0, 10).map((heartbeat: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                          >
                            <Badge
                              variant={heartbeat.status === "CONNECTED" ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {heartbeat.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(heartbeat.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent heartbeats recorded</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No health data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Status History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusHistory.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {statusHistory.map((entry: any, index: number) => (
                    <div key={entry.id || index} className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.metadata?.oldStatus || "Unknown"}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="default" className="text-xs">
                            {entry.metadata?.newStatus || "Unknown"}
                          </Badge>
                        </div>
                        {entry.user && <span className="text-sm text-muted-foreground">by {entry.user.username}</span>}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No status history available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  GPS Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">GPS tracking data will be displayed here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  Fuel Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Fuel monitoring data will be displayed here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  OBD Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">OBD diagnostic data will be displayed here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Emission Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Emission monitoring data will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {device && (
        <>
          <UpdateAndAddDeviceSheet
            deviceId={device.id}
            isEditing={true}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onDeviceUpdated={fetchDeviceData}
          />
          <DeleteDeviceDialog
            device={device}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onDeleted={() => router.push("/dashboard/tracking-devices")}
          />
          <DeviceStatusSheet
            device={device}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onStatusUpdated={fetchDeviceData}
          />
          <MonitoringFeaturesDialog
            device={device}
            open={monitoringDialogOpen}
            onOpenChange={setMonitoringDialogOpen}
            onFeaturesUpdated={fetchDeviceData}
          />
        </>
      )}
    </div>
  )
}
