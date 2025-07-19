"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { DeviceStatus } from "@/types/EnumTypes"
import { batchUpdateDeviceStatuses } from "@/services/trackingDeviceService"
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes"

interface BulkActionsDialogProps {
  selectedDevices: TrackingDeviceListItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BulkActionsDialog({ selectedDevices, open, onOpenChange, onSuccess }: BulkActionsDialogProps) {
  const [action, setAction] = useState<"status" | "">("")
  const [newStatus, setNewStatus] = useState<string>("")
  const [force, setForce] = useState(false)
  const [disableMonitoring, setDisableMonitoring] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleBulkStatusUpdate = async () => {
    if (!newStatus || selectedDevices.length === 0) return

    setIsLoading(true)
    try {
      await batchUpdateDeviceStatuses({
        deviceIds: selectedDevices.map((d) => d.id),
        status: newStatus,
        force,
        disableMonitoring,
      })

      toast.success(`Successfully updated ${selectedDevices.length} devices to ${newStatus}`)
      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to update devices"
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setAction("")
    setNewStatus("")
    setForce(false)
    setDisableMonitoring(true)
  }

  const getStatusCounts = () => {
    const counts: Record<string, number> = {}
    selectedDevices.forEach((device) => {
      counts[device.status] = (counts[device.status] || 0) + 1
    })
    return counts
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Actions
          </DialogTitle>
          <DialogDescription>Perform actions on {selectedDevices.length} selected devices</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Devices Summary */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Selected Devices ({selectedDevices.length})</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(getStatusCounts()).map(([status, count]) => (
                <Badge key={status} variant="outline" className="text-xs">
                  {status}: {count}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Action</Label>
            <Select value={action} onValueChange={(value: "status" | "") => setAction(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Update Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Update Options */}
          {action === "status" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DeviceStatus).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {value.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="force" checked={force} onCheckedChange={(checked) => setForce(checked as boolean)} />
                  <Label htmlFor="force" className="text-sm">
                    Force status change (ignore validation)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disableMonitoring"
                    checked={disableMonitoring}
                    onCheckedChange={(checked) => setDisableMonitoring(checked as boolean)}
                  />
                  <Label htmlFor="disableMonitoring" className="text-sm">
                    Disable monitoring features for inactive devices
                  </Label>
                </div>
              </div>

              {!force && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Status Validation</p>
                    <p>
                      Some devices may fail validation if the status transition is invalid. Enable "Force" to override.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkStatusUpdate}
            disabled={!action || (action === "status" && !newStatus) || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply to {selectedDevices.length} devices
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
