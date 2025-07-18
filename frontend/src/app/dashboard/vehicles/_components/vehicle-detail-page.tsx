"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Car, User, Fuel, Activity, AlertTriangle, Settings, BarChart3, Edit, Trash2 } from "lucide-react"


import { VehicleFullDetails } from "../VehicleTypes"
import vehicleService from "../services"
import VehicleDrawer from "./vehicle-drawer"


interface VehicleDetailPageProps {
  vehicleId: number
}

export function VehicleDetailPage({ vehicleId }: VehicleDetailPageProps) {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<VehicleFullDetails| null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const data = await vehicleService.getVehicleById(vehicleId)
      setVehicle(data)
    } catch (error) {
      console.error("Failed to fetch vehicle:", error)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  const handleDelete = async () => {
    if (!vehicle) return

    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleService.softDeleteVehicle(vehicle.id)
    
        router.back()
      } catch (error) {
        console.error("Failed to delete vehicle:", error)

      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL_EMISSION":
        return "bg-green-100 text-green-800"
      case "TOP_POLLUTING":
        return "bg-red-100 text-red-800"
      case "INACTIVE_DISCONNECTED":
        return "bg-gray-100 text-gray-800"
      case "UNDER_MAINTENANCE":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmissionColor = (status: string) => {
    switch (status) {
      case "LOW":
        return "bg-green-100 text-green-800"
      case "NORMAL":
        return "bg-blue-100 text-blue-800"
      case "HIGH":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Vehicle not found</h1>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vehicle.plateNumber}</h1>
            <p className="text-muted-foreground">
              {vehicle.vehicleModel} • {vehicle.yearOfManufacture}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setDrawerOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Basic Info Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emission Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getEmissionColor(vehicle.emissionStatus)}>{vehicle.emissionStatus}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Type</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicle.fuelType || "N/A"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owner</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{vehicle.user?.username}</div>
            <div className="text-xs text-muted-foreground">{vehicle.user?.email}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                <p className="text-sm">{vehicle.registrationNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chassis Number</p>
                <p className="text-sm">{vehicle.chassisNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicle Type</p>
                <p className="text-sm">{vehicle.vehicleType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usage</p>
                <p className="text-sm">{vehicle.usage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Maintenance</p>
                <p className="text-sm">
                  {vehicle.lastMaintenanceDate ? new Date(vehicle.lastMaintenanceDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle.connectionState ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={vehicle.connectionState.status === "CONNECTED" ? "default" : "secondary"}>
                    {vehicle.connectionState.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(vehicle.connectionState.lastUpdated).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Socket ID</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {vehicle.connectionState.socketId.substring(0, 8)}...
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No connection data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed data */}
      <Tabs defaultValue="tracking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracking">Tracking Devices</TabsTrigger>
          <TabsTrigger value="emissions">Emissions</TabsTrigger>
          <TabsTrigger value="gps">GPS Data</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Data</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Devices</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.trackingDevices?.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.trackingDevices.map((device) => (
                    <div key={device.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                          <p className="text-sm">{device.serialNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge variant={device.status === "ACTIVE" ? "default" : "secondary"}>{device.status}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Protocol</p>
                          <p className="text-sm">{device.communicationProtocol}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Firmware</p>
                          <p className="text-sm">{device.firmwareVersion || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No tracking devices found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Emission Data</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.emissionData.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.emissionData.slice(0, 10).map((emission) => (
                    <div key={emission.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">CO2 %</p>
                          <p className="text-sm">{emission.co2Percentage}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">NOx PPM</p>
                          <p className="text-sm">{emission.noxPPM || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">PM2.5</p>
                          <p className="text-sm">{emission.pm25Level || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                          <p className="text-sm">{new Date(emission.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No emission data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gps">
          <Card>
            <CardHeader>
              <CardTitle>Recent GPS Data</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.gpsData.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.gpsData.slice(0, 10).map((gps) => (
                    <div key={gps.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p className="text-sm">
                            {gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Speed</p>
                          <p className="text-sm">{gps.speed} km/h</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                          <p className="text-sm">{gps.accuracy || "N/A"}m</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                          <p className="text-sm">{new Date(gps.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No GPS data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle>Recent Fuel Data</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.fuelData.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.fuelData.slice(0, 10).map((fuel) => (
                    <div key={fuel.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fuel Level</p>
                          <p className="text-sm">{fuel.fuelLevel}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Consumption</p>
                          <p className="text-sm">{fuel.fuelConsumption}L</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                          <p className="text-sm">{new Date(fuel.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No fuel data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.alerts.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.alerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={alert.isRead ? "secondary" : "default"}>
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
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Records</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.maintenanceRecords.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.maintenanceRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{record.type}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.performedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {record.description && <p className="text-sm text-muted-foreground">{record.description}</p>}
                        {record.recommendedAction && (
                          <p className="text-sm">
                            <strong>Recommended:</strong> {record.recommendedAction}
                          </p>
                        )}
                        {record.nextDueDate && (
                          <p className="text-sm">
                            <strong>Next Due:</strong> {new Date(record.nextDueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No maintenance records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Vehicle Drawer */}
      <VehicleDrawer

   
     
        vehicleId={vehicle.id}

      />
    </div>
  )
}
