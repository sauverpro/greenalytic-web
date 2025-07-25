"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Play, Pause, RotateCcw, Zap, Car, Clock, Gauge } from "lucide-react"
import { GpsDataResponseDTO } from "./gpsTypes"
import gpsService from "./gpsService"


// Mock map component - replace with your preferred map library (Google Maps, Mapbox, etc.)
interface MapProps {
  center: { lat: number; lng: number }
  zoom: number
  vehicles: VehicleMarker[]
  selectedVehicle?: number
  onVehicleSelect: (vehicleId: number) => void
  showRoute?: boolean
  routeData?: GpsDataResponseDTO[]
}

interface VehicleMarker {
  id: number
  plateNumber: string
  position: { lat: number; lng: number }
  speed: number
  speedLevel: "NORMAL" | "HIGH" | "CRITICAL"
  timestamp: Date
  heading?: number
  isOnline: boolean
}

function MapComponent({ center, zoom, vehicles, selectedVehicle, onVehicleSelect, showRoute, routeData }: MapProps) {
  // This is a placeholder - implement with your preferred map library
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Map Component Placeholder</p>
          <p className="text-sm text-gray-400 mt-2">Integrate with Google Maps, Mapbox, or Leaflet</p>
        </div>
      </div>

      {/* Vehicle markers overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`p-2 bg-white rounded-lg shadow-md cursor-pointer border-2 ${
              selectedVehicle === vehicle.id ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => onVehicleSelect(vehicle.id)}
          >
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="font-medium text-sm">{vehicle.plateNumber}</span>
              <Badge
                variant={
                  vehicle.speedLevel === "CRITICAL"
                    ? "destructive"
                    : vehicle.speedLevel === "HIGH"
                      ? "secondary"
                      : "default"
                }
                className="text-xs"
              >
                {vehicle.speed} km/h
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface VehicleTrackingMapProps {
  selectedVehicleId?: number
  onVehicleSelect?: (vehicleId: number) => void
  autoRefresh?: boolean
  refreshInterval?: number
}

export function VehicleTrackingMap({
  selectedVehicleId,
  onVehicleSelect,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: VehicleTrackingMapProps) {
  const [vehicles, setVehicles] = useState<VehicleMarker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [mapZoom, setMapZoom] = useState(10)
  const [isPlaying, setIsPlaying] = useState(autoRefresh)
  const [showRoute, setShowRoute] = useState(false)
  const [routeData, setRouteData] = useState<GpsDataResponseDTO[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<number | undefined>(selectedVehicleId)
  const [filterVehicleId, setFilterVehicleId] = useState<string>("")

const intervalRef = useRef<NodeJS.Timeout | null>(null)


  const fetchVehicleData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const vehicleIds = filterVehicleId ? [Number.parseInt(filterVehicleId)] : undefined
      const gpsData = await gpsService.getRealTimeGpsData(vehicleIds)

      // Group by vehicle and get latest position for each
      const vehicleMap = new Map<number, GpsDataResponseDTO>()

      gpsData.forEach((data) => {
        const existing = vehicleMap.get(data.vehicleId)
        if (!existing || new Date(data.timestamp) > new Date(existing.timestamp)) {
          vehicleMap.set(data.vehicleId, data)
        }
      })

      const vehicleMarkers: VehicleMarker[] = Array.from(vehicleMap.values()).map((data) => ({
        id: data.vehicleId,
        plateNumber: data.plateNumber,
        position: { lat: data.latitude, lng: data.longitude },
        speed: data.speed,
        speedLevel: data.speedLevel || "NORMAL",
        timestamp: new Date(data.timestamp),
        isOnline: Date.now() - new Date(data.timestamp).getTime() < 300000, // 5 minutes
      }))

      setVehicles(vehicleMarkers)

      // Update map center to show all vehicles or selected vehicle
      if (vehicleMarkers.length > 0) {
        if (selectedVehicle) {
          const selected = vehicleMarkers.find((v) => v.id === selectedVehicle)
          if (selected) {
            setMapCenter(selected.position)
            setMapZoom(15)
          }
        } else {
          // Center on all vehicles
          const avgLat = vehicleMarkers.reduce((sum, v) => sum + v.position.lat, 0) / vehicleMarkers.length
          const avgLng = vehicleMarkers.reduce((sum, v) => sum + v.position.lng, 0) / vehicleMarkers.length
          setMapCenter({ lat: avgLat, lng: avgLng })
          setMapZoom(12)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vehicle data")
      console.error("Error fetching vehicle data:", err)
    } finally {
      setLoading(false)
    }
  }, [filterVehicleId, selectedVehicle])

  const fetchRouteData = useCallback(async (vehicleId: number) => {
    try {
      const endTime = new Date()
      const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // Last 24 hours

      const route = await gpsService.getVehicleRoute(vehicleId, startTime, endTime)
      setRouteData(route)
    } catch (err) {
      console.error("Error fetching route data:", err)
    }
  }, [])

  const handleVehicleSelect = (vehicleId: number) => {
    setSelectedVehicle(vehicleId)
    onVehicleSelect?.(vehicleId)

    if (showRoute) {
      fetchRouteData(vehicleId)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleRoute = () => {
    setShowRoute(!showRoute)
    if (!showRoute && selectedVehicle) {
      fetchRouteData(selectedVehicle)
    } else {
      setRouteData([])
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    if (isPlaying) {
      fetchVehicleData() // Initial fetch
      intervalRef.current = setInterval(fetchVehicleData, refreshInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, fetchVehicleData, refreshInterval])

  // Initial load
  useEffect(() => {
    fetchVehicleData()
  })

  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle)

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Vehicle Tracking Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={togglePlayPause} className="gap-2 bg-transparent">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchVehicleData()}
                disabled={loading}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="vehicleFilter" className="text-sm whitespace-nowrap">
                Filter Vehicle:
              </Label>
              <Input
                id="vehicleFilter"
                type="number"
                placeholder="Vehicle ID"
                value={filterVehicleId}
                onChange={(e) => setFilterVehicleId(e.target.value)}
                className="w-32"
              />
            </div>

            <Button
              variant={showRoute ? "default" : "outline"}
              size="sm"
              onClick={toggleRoute}
              disabled={!selectedVehicle}
              className="gap-2"
            >
              <Navigation className="h-4 w-4" />
              {showRoute ? "Hide Route" : "Show Route"}
            </Button>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Online ({vehicles.filter((v) => v.isOnline).length})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Offline ({vehicles.filter((v) => !v.isOnline).length})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="h-[600px]">
              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                onVehicleSelect={handleVehicleSelect}
                showRoute={showRoute}
                routeData={routeData}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedVehicleData ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plate Number</span>
                    <Badge variant="outline" className="font-mono">
                      {selectedVehicleData.plateNumber}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={selectedVehicleData.isOnline ? "default" : "secondary"}>
                      {selectedVehicleData.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Speed</span>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span className="font-medium">{selectedVehicleData.speed} km/h</span>
                      <Badge
                        variant={
                          selectedVehicleData.speedLevel === "CRITICAL"
                            ? "destructive"
                            : selectedVehicleData.speedLevel === "HIGH"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {selectedVehicleData.speedLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Update</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{selectedVehicleData.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium">Position</span>
                    <div className="text-xs font-mono text-muted-foreground">
                      <div>Lat: {selectedVehicleData.position.lat.toFixed(6)}</div>
                      <div>Lng: {selectedVehicleData.position.lng.toFixed(6)}</div>
                    </div>
                  </div>
                </div>

                {showRoute && routeData.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-sm">Route Summary (24h)</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Points:</span>
                        <span className="font-medium">{routeData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Speed:</span>
                        <span className="font-medium">{Math.max(...routeData.map((d) => d.speed))} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Speed:</span>
                        <span className="font-medium">
                          {(routeData.reduce((sum, d) => sum + d.speed, 0) / routeData.length).toFixed(1)} km/h
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a vehicle to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <Zap className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
