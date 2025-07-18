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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  softDeleteTrackingDevice,
  deleteTrackingDevicePermanently,
} from "@/services/trackingDeviceService";
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes";

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
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionType, setDeletionType] = useState<"soft" | "hard">("soft");

  const handleDelete = async () => {
    if (deletionType === "hard" && confirmText !== device.serialNumber) {
      toast.error(
        "Please type the serial number correctly to confirm permanent deletion"
      );
      return;
    }

    setIsDeleting(true);
    try {
      if (deletionType === "hard") {
        await deleteTrackingDevicePermanently(device.id);
        toast.success(`Device ${device.serialNumber} permanently deleted`);
      } else {
        await softDeleteTrackingDevice(device.id);
        toast.success(`Device ${device.serialNumber} temporarily deactivated`);
      }

      onDeleted();
      onOpenChange(false);
      setConfirmText("");
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

  const handleCancel = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  const isConfirmValid =
    deletionType === "soft" || confirmText === device.serialNumber;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[550px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {deletionType === "hard"
              ? "Permanently Delete Device"
              : "Deactivate Device"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deletionType === "hard"
              ? "This will permanently delete this device and all related data."
              : "This will temporarily deactivate the device but keep its data."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setDeletionType((prev) => (prev === "soft" ? "hard" : "soft"))
              }
              className="text-xs"
            >
              Switch to {deletionType === "soft" ? "Hard" : "Soft"} Delete
            </Button>
          </div>

          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Serial Number:</strong> {device.serialNumber}
                </div>
                <div>
                  <strong>Model:</strong> {device.model}
                </div>
                <div>
                  <strong>Type:</strong> {device.type}
                </div>
                <div>
                  <strong>Plate:</strong> {device.plateNumber}
                </div>
                <div>
                  <strong>Status:</strong> {device.status}
                </div>
                <div>
                  <strong>Category:</strong> {device.deviceCategory}
                </div>
              </div>
            </CardContent>
          </Card>

          {deletionType === "hard" && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-800" />
                  <h3 className="font-semibold text-yellow-800">
                    Warning: Permanent Deletion
                  </h3>
                </div>
                <p className="text-sm text-yellow-800 mb-3">
                  This action cannot be undone. The device and all associated
                  data will be permanently removed from the system.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirm-serial" className="text-yellow-800">
                    Type{" "}
                    <span className="font-mono font-bold">
                      {device.serialNumber}
                    </span>{" "}
                    to confirm permanent deletion:
                  </Label>
                  <Input
                    id="confirm-serial"
                    type="text"
                    placeholder={device.serialNumber}
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className={`${
                      confirmText && confirmText !== device.serialNumber
                        ? "border-red-300 focus:border-red-500"
                        : confirmText === device.serialNumber
                        ? "border-green-300 focus:border-green-500"
                        : ""
                    }`}
                  />
                  {confirmText && confirmText !== device.serialNumber && (
                    <p className="text-sm text-red-600">
                      Serial number does not match
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {deletionType === "soft" && (
            <div className="text-sm text-muted-foreground">
              <p>
                This device will be deactivated but can be restored later by an
                administrator. All associated data will be preserved.
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {deletionType === "hard" ? "Deleting..." : "Deactivating..."}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {deletionType === "hard"
                  ? "Delete Permanently"
                  : "Deactivate Device"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
