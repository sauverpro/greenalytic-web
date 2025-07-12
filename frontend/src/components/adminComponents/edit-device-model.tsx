"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";
import { updateTrackingDevice } from "@/services/deviceServices";

// Schema for device editing
const deviceEditSchema = z.object({
  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  isActive: z.boolean(),
  status: z.string().min(1, "Status is required"),
});

type DeviceEditValues = z.infer<typeof deviceEditSchema>;

interface TrackingDevice {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  isActive: boolean;
  status: string;
  lastPing?: string | Date;
  userId?: number;
  vehicleId?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
}

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: TrackingDevice | null;
  onSuccess?: () => void;
}

export function EditDeviceModal({
  isOpen,
  onClose,
  device,
  onSuccess,
}: EditDeviceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<DeviceEditValues>({
    resolver: zodResolver(deviceEditSchema),
    defaultValues: {
      serialNumber: "",
      model: "",
      type: "",
      plateNumber: "",
      isActive: true,
      status: "active",
    },
  });

  // Update form values when device changes
  useEffect(() => {
    if (device) {
      form.reset({
        serialNumber: device.serialNumber,
        model: device.model,
        type: device.type,
        plateNumber: device.plateNumber,
        isActive: device.isActive,
        status: device.status,
      });
    }
  }, [device, form]);

  async function onSubmit(data: DeviceEditValues) {
    if (!device) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedDevice = {
        ...data,
        id: device.id,
        vehicleId: device.vehicleId ?? 0, 
      };
      await updateTrackingDevice(device.id.toString(), updatedDevice);

      toast.success("Device updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update device:", error);

      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      toast.error("Failed to update device");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-amber-100 p-2">
              <Settings className="h-5 w-5 text-amber-700" />
            </div>
            <DialogTitle>Edit Tracking Device</DialogTitle>
          </div>
          <DialogDescription>
            Update tracking device information. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <Alert
                variant="destructive"
                className="bg-red-50 text-red-800 border border-red-200"
              >
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GPS">GPS</SelectItem>
                        <SelectItem value="FUEL">FUEL</SelectItem>
                        <SelectItem value="EMISSION">EMISSION</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plate Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="disconnected">
                          Disconnected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-6">
                    <div className="space-y-0.5">
                      <FormLabel>Active State</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Device ID:</span> {device?.id}
                </p>
                {device?.lastPing && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Last Ping:</span>{" "}
                    {new Date(device.lastPing).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Device"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
