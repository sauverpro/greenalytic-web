"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
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
import { addDeviceToVehicle } from "../../services/deviceServices";
import { TrackingDevice } from "@/types/types";
import { toast } from "sonner";

// Define the form schema with validation
const deviceFormSchema = z.object({
  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
});

// Infer the type from the schema
type DeviceFormValues = z.infer<typeof deviceFormSchema>;

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  availableVehicles: Array<{ id: string; plate: string }>;
  onSuccess?: () => void;
}

export function AddDeviceModal({
  isOpen,
  onClose,
  vehicleId,
  availableVehicles,
  onSuccess,
}: AddDeviceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the selected vehicle's plate number
  const selectedVehicle = availableVehicles.find((v) => v.id === vehicleId);

  // Initialize the form with default values
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      serialNumber: "",
      model: "",
      type: "",
      plateNumber: selectedVehicle?.plate || "",
    },
  });


   useEffect(() => {
     if (vehicleId && selectedVehicle) {
       form.setValue("plateNumber", selectedVehicle.plate);
     }
   }, [vehicleId, selectedVehicle, form]);

  // Handle form submission
  async function onSubmit(data: DeviceFormValues) {
    setIsSubmitting(true);
    try {
      const completeDeviceData: TrackingDevice = {
        ...data,
        id: 0, 
        isActive: true,
        lastPing: undefined,
        gpsDatas: [],
        fuelDatas: [],
        emissionDatas: [],
        userId: undefined,
        vehicleId: parseInt(vehicleId),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      };
      await addDeviceToVehicle(vehicleId, completeDeviceData);
      console.log("vehicle id ", vehicleId);
      
      toast("Device added successfully");
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to add device:", error);
      toast("Failed to add device");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 p-2">
              <MapPin className="h-5 w-5 text-blue-700" />
            </div>
            <DialogTitle>Add New Device</DialogTitle>
          </div>
          <DialogDescription>
            Add a new tracking device to a vehicle. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="AD123" {...field} />
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
                      <Input placeholder="GPS Tracker" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <FormLabel>Vehicle Plate Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Plate Number"
                        {...field}
                        disabled={true}
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Device"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
