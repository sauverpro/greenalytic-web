"use client";

import React, { useState, useEffect } from "react";
import { Car } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateVehicle } from "@/services/vehicleService";
import { toast } from "sonner";
import { IUpdateVehicle } from "@/app/(admin)/admin/vehicles/ExportUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: IUpdateVehicle | null;
  onSuccess: () => void;
}

// Define the form schema with validation
const vehicleFormSchema = z.object({
  plateNumber: z.string().min(3, "Plate number must be at least 3 characters"),
  chassisNumber: z
    .string()
    .min(5, "Chassis number must be at least 5 characters"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  yearOfManufacture: z.coerce
    .number()
    .min(1990, "Year must be 1990 or later")
    .max(
      new Date().getFullYear() + 1,
      `Year cannot be later than ${new Date().getFullYear() + 1}`
    ),
  usage: z.string().min(1, "Usage is required"),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onSuccess,
}: EditVehicleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plateNumber: "",
      chassisNumber: "",
      vehicleType: "",
      vehicleModel: "",
      yearOfManufacture: new Date().getFullYear(),
      usage: "",
    },
  });

  useEffect(() => {
    if (vehicle) {
      // Map from UI model to form model
      form.reset({
        plateNumber: vehicle.licensePlate || "",
        chassisNumber: vehicle.chassisNumber || "",
        vehicleType: vehicle.vehicleType || "",
        vehicleModel: vehicle.model || "",
        yearOfManufacture: vehicle.year || new Date().getFullYear(),
        usage: vehicle.usage || "",
      });
      console.log("Loaded vehicle data:", vehicle);
    }
  }, [vehicle, form]);

  async function onSubmit(data: VehicleFormValues) {
    if (!vehicle) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting data:", data);
      if (vehicle.id) {
        await updateVehicle(vehicle.id.toString(), data);
        toast.success("Vehicle updated successfully");
        onSuccess();
        onClose();
      } else {
        console.error("Vehicle ID is undefined");
        toast.error("Vehicle ID is missing");
      }
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update vehicle";
      toast.error(errorMessage);
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
              <Car className="h-5 w-5 text-blue-700" />
            </div>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </div>
          <DialogDescription>Update the vehicle information.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plate Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chassisNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chassis Number</FormLabel>
                    <FormControl>
                      <Input placeholder="XW8FG98765" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Coupe">Coupe</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                        <SelectItem value="Wagon">Wagon</SelectItem>
                        <SelectItem value="Minivan">Minivan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota RAV4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yearOfManufacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Manufacture</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Fleet">Fleet</SelectItem>
                        <SelectItem value="Rental">Rental</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
