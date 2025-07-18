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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import vehicleService from "../services";
import type { VehicleListItemWithUser } from "../VehicleTypes";

interface DeleteVehicleDialogProps {
  vehicle: VehicleListItemWithUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteVehicleDialog({
  vehicle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteVehicleDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionType, setDeletionType] = useState<"soft" | "hard">("soft");

  const handleDelete = async () => {
    if (confirmText !== vehicle.plateNumber) {
      toast.error("Please type the plate number correctly to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      if (deletionType === "hard") {
        await vehicleService.deleteVehicle(vehicle.id);
      } else {
        await vehicleService.softDeleteVehicle(vehicle.id);
      }

      toast.success(
        `Vehicle ${
          deletionType === "hard" ? "permanently" : "temporarily"
        } deleted`
      );
      onDeleted?.();
      onOpenChange(false);
      setConfirmText("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete vehicle"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  const isConfirmValid = confirmText === vehicle.plateNumber;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {deletionType === "hard"
              ? "Hard Delete Vehicle"
              : "Soft Delete Vehicle"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deletionType === "hard"
              ? "This will permanently delete this vehicle and all related data."
              : "This will deactivate the vehicle but keep its data."}
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
            <CardHeader>
              <CardTitle className="text-lg">Vehicle to be deleted:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Plate Number:</strong> {vehicle.plateNumber}
                </div>
                <div>
                  <strong>Model:</strong> {vehicle.vehicleModel}
                </div>
                <div>
                  <strong>Type:</strong> {vehicle.vehicleType}
                </div>
                <div>
                  <strong>Year:</strong> {vehicle.yearOfManufacture}
                </div>
                <div>
                  <strong>Status:</strong> {vehicle.status.replace(/_/g, " ")}
                </div>
                <div>
                  <strong>Owner:</strong>{" "}
                  {vehicle.user?.username || "Not assigned"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Warning: Vehicle has associated data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800 mb-3">
                This vehicle may have associated data that will also be
                affected:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Tracking devices</div>
                <div>• GPS data</div>
                <div>• Emission records</div>
                <div>• Fuel data</div>
                <div>• Maintenance records</div>
                <div>• Alert history</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="confirm-plate">
              Type{" "}
              <span className="font-mono font-bold">{vehicle.plateNumber}</span>{" "}
              to confirm deletion:
            </Label>
            <Input
              id="confirm-plate"
              type="text"
              placeholder={vehicle.plateNumber}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`${
                confirmText && !isConfirmValid
                  ? "border-red-300 focus:border-red-500"
                  : isConfirmValid
                  ? "border-green-300 focus:border-green-500"
                  : ""
              }`}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-sm text-red-600">
                Plate number does not match
              </p>
            )}
          </div>
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
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Vehicle
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
