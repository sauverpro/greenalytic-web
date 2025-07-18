"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, MapPin, Gauge, Fuel, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes"
import { toggleMonitoringFeature } from "@/services/trackingDeviceService"

interface MonitoringFeaturesDialogProps {
  device: TrackingDeviceListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onFeaturesUpdated: () => void
}

interface MonitoringFeatures {
  obd: boolean
  gps: boolean
  emission: boolean
  fuel: boolean
  ignoreStatusCheck: boolean
}

export function MonitoringFeaturesDialog({
  device,
  open,
  onOpenChange,
  onFeaturesUpdated,
}: MonitoringFeaturesDialogProps) {
  const [features, setFeatures] = useState<MonitoringFeatures>({
    obd: device?.enableOBDMonitoring || false,
    gps: device?.enableGPSTracking || false,
    emission: device?.enableEmissionMonitoring || false,
    fuel: device?.enableFuelMonitoring || false,
    ignoreStatusCheck: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update features when device changes
  React.useEffect(() => {
    if (device) {
      setFeatures({
        obd: device.enableOBDMonitoring || false,
        gps: device.enableGPSTracking || false,
        emission: device.enableEmissionMonitoring || false,
        fuel: device.enableFuelMonitoring || false,
        ignoreStatusCheck: false,
      })
    }
  }, [device])

  const handleFeatureToggle = (feature: keyof Omit<MonitoringFeatures, "ignoreStatusCheck">, value: boolean) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: value,
    }))
  }

  const handleSave = async () => {
    if (!device) return

    setIsLoading(true)
    try {
      await toggleMonitoringFeature(device.id, features)
      toast.success(`Monitoring features updated for ${device.serialNumber}`)
      onFeaturesUpdated()
      onOpenChange(false)
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to update monitoring features"
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "obd":
        return <Car className="h-4 w-4" />
      case "gps":
        return <MapPin className="h-4 w-4" />
      case "emission":
        return <Gauge className="h-4 w-4" />
      case "fuel":
        return <Fuel className="h-4 w-4" />
      default:
        return null
    }
  }

  const getFeatureDescription = (feature: string) => {
    switch (feature) {
      case "obd":
        return "Monitor vehicle diagnostics and engine data"
      case "gps":
        return "Track real-time location and movement"
      case "emission":
        return "Monitor vehicle emissions and environmental impact"
      case "fuel":
        return "Track fuel consumption and efficiency"
      default:
        return ""
    }
  }

  if (!device) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Monitoring Features</DialogTitle>
          <DialogDescription>
            Configure monitoring features for device {device.serialNumber} ({device.plateNumber})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Device Status Warning */}
          {device.status !== "ACTIVE" && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    Device is currently {device.status.toLowerCase()}. Some features may not work properly.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monitoring Features */}
          <div className="space-y-4">
            {Object.entries(features)
              .filter(([key]) => key !== "ignoreStatusCheck")
              .map(([key, value]) => (
                <Card key={key} className="border-2 transition-colors hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFeatureIcon(key)}
                        <CardTitle className="text-base capitalize">{key === "obd" ? "OBD" : key} Monitoring</CardTitle>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          handleFeatureToggle(key as keyof Omit<MonitoringFeatures, "ignoreStatusCheck">, checked)
                        }
                        disabled={isLoading}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{getFeatureDescription(key)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Advanced Options */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignoreStatusCheck"
                  checked={features.ignoreStatusCheck}
                  onCheckedChange={(checked) =>
                    setFeatures((prev) => ({ ...prev, ignoreStatusCheck: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="ignoreStatusCheck" className="text-sm">
                  Ignore device status check
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enable features even if device is not active (use with caution)
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
