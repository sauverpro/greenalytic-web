"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Table, BarChart3, Settings } from "lucide-react"
import { GpsDataResponseDTO } from "./_components/gpsTypes"
import { GpsDataTable } from "./_components/GpsDataTable"
import { VehicleTrackingMap } from "./_components/VehicleTrackingMap"


export default function GpsTrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<number | undefined>()
  const [activeTab, setActiveTab] = useState("table")

  const handleViewOnMap = (gpsData: GpsDataResponseDTO) => {
    setSelectedVehicle(gpsData.vehicleId)
    setActiveTab("map")
  }

  const handleVehicleSelect = (vehicleId: number) => {
    setSelectedVehicle(vehicleId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GPS Tracking System</h1>
          <p className="text-muted-foreground">Monitor and track vehicle locations in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Tracking
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table" className="gap-2">
            <Table className="h-4 w-4" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <MapPin className="h-4 w-4" />
            Live Map
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <GpsDataTable
            onViewOnMap={handleViewOnMap}
            onEdit={(gpsData) => {
              console.log("Edit GPS data:", gpsData)
              // Implement edit functionality
            }}
            onDelete={(id) => {
              console.log("Delete GPS data:", id)
              // Implement delete functionality
            }}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <VehicleTrackingMap
            selectedVehicleId={selectedVehicle}
            onVehicleSelect={handleVehicleSelect}
            autoRefresh={true}
            refreshInterval={30000}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GPS Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GPS Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
