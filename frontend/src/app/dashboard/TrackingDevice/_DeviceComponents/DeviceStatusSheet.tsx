"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Activity,
  Battery,
  Signal,
} from "lucide-react";
import { toast } from "sonner";
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes";
import { updateDeviceStatus } from "@/services/trackingDeviceService";

interface DeviceStatusSheetProps {
  device: TrackingDeviceListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdated: () => void;
}

export function DeviceStatusSheet({
  device,
  open,
  onOpenChange,
  onStatusUpdated,
}: DeviceStatusSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState(device.status);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [disableMonitoring, setDisableMonitoring] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === device.status) {
      toast.info("No changes to update");
      return;
    }

    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      await updateDeviceStatus(device.id, {
        status: selectedStatus,
        force: forceUpdate,
        disableMonitoring,
      });

      toast.success(`Device status updated to ${selectedStatus}`);
      setSuccess(true);
      onStatusUpdated();

      // Close sheet after a brief delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1000);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update device status";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px]" side="right">
        <SheetHeader>
          <SheetTitle>Device Status Management</SheetTitle>
          <SheetDescription>
            Update the status of device {device.serialNumber}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Current Device Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Serial Number:</span>
                <span className="text-sm">{device.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Model:</span>
                <span className="text-sm">{device.model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Status:</span>
                <Badge variant={getStatusVariant(device.status)}>
                  {device.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Battery Level:</span>
                <div className="flex items-center gap-1">
                  <Battery className="h-4 w-4" />
                  <span className="text-sm">{device.batteryLevel}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Signal Strength:</span>
                <div className="flex items-center gap-1">
                  <Signal className="h-4 w-4" />
                  <span className="text-sm">{device.signalStrength}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Ping:</span>
                <span className="text-sm">
                  {device.lastPing
                    ? new Date(device.lastPing).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status Update Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">New Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="INACTIVE">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-yellow-600" />
                      Inactive
                    </div>
                  </SelectItem>
                  <SelectItem value="DISCONNECTED">
                    <div className="flex items-center gap-2">
                      <Signal className="h-4 w-4 text-red-600" />
                      Disconnected
                    </div>
                  </SelectItem>
                  <SelectItem value="MAINTENANCE">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Maintenance
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forceUpdate"
                  checked={forceUpdate}
                  onCheckedChange={(checked) =>
                    setForceUpdate(checked as boolean)
                  }
                  disabled={isUpdating}
                />
                <Label htmlFor="forceUpdate" className="text-sm">
                  Force update (bypass validation)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disableMonitoring"
                  checked={disableMonitoring}
                  onCheckedChange={(checked) =>
                    setDisableMonitoring(checked as boolean)
                  }
                  disabled={isUpdating}
                />
                <Label htmlFor="disableMonitoring" className="text-sm">
                  Disable monitoring features when not active
                </Label>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Device status updated successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <SheetFooter className="flex justify-between gap-2">
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || success || selectedStatus === device.status}
            className="flex-1"
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success && <CheckCircle2 className="mr-2 h-4 w-4" />}
            {isUpdating
              ? "Updating..."
              : success
              ? "Success!"
              : "Update Status"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
