"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes";
import { softDeleteTrackingDevice } from "@/services/trackingDeviceService";

interface DeleteDeviceDialogProps {
  device: TrackingDeviceListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteDeviceDialog({
  device,
  open,
  onOpenChange,
  onDeleted,
}: DeleteDeviceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await softDeleteTrackingDevice(device.id);
      toast.success(`Device ${device.serialNumber} deleted successfully`);
      onDeleted();
      onOpenChange(false);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete device";
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Tracking Device
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the device{" "}
              <strong>{device.serialNumber}</strong>?
            </p>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p>
                <strong>Model:</strong> {device.model}
              </p>
              <p>
                <strong>Type:</strong> {device.type}
              </p>
              <p>
                <strong>Plate:</strong> {device.plateNumber}
              </p>
              <p>
                <strong>Status:</strong> {device.status}
              </p>
            </div>
            <p className="text-destructive font-medium">
              This action will soft delete the device. It can be restored later
              by an administrator.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Device"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
