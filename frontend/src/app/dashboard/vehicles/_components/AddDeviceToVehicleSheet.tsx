"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import vehicleService from "../services";
import type { AssignDeviceToVehicleRequest, VehicleListItemWithUser } from "../VehicleTypes";

interface AddDeviceToVehicleSheetProps {
  vehicle: VehicleListItemWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeviceAdded?: () => void;
}

// Schema matching your Prisma enums exactly
const deviceSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  deviceCategory: z.enum(["MOTORCYCLE", "CAR", "TRUCK", "TRICYCLE", "OTHER"], {
    errorMap: () => ({ message: "Device category is required" }),
  }),
  firmwareVersion: z.string().optional(),
  simCardNumber: z.string().optional(),
  installationDate: z.string().optional(),
  communicationProtocol: z.enum(["MQTT", "HTTP", "SMS"], {
    errorMap: () => ({ message: "Communication protocol is required" }),
  }),
  dataTransmissionInterval: z
    .string()
    .min(1, "Data transmission interval is required"),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

export function AddDeviceToVehicleSheet({
  vehicle,
  open,
  onOpenChange,
  onDeviceAdded,
}: AddDeviceToVehicleSheetProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      serialNumber: "",
      model: "",
      type: "",
      deviceCategory: undefined,
      firmwareVersion: "",
      simCardNumber: "",
      installationDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
      communicationProtocol: undefined,
      dataTransmissionInterval: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  const onSubmit = async (data: DeviceFormData) => {
    if (!vehicle) {
      setSubmitError("No vehicle selected");
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Prepare payload with auto-filled data from selected vehicle
      const payload = {
        serialNumber: data.serialNumber,
        model: data.model,
        type: data.type,
        plateNumber: vehicle.plateNumber, // Auto-filled from selected vehicle
        deviceCategory: data.deviceCategory as "MOTORCYCLE" | "CAR" | "TRUCK" | "TRICYCLE" | "OTHER",
        firmwareVersion: data.firmwareVersion || undefined,
        simCardNumber: data.simCardNumber || undefined,
        installationDate: data.installationDate || new Date().toISOString(),
        communicationProtocol: data.communicationProtocol,
        dataTransmissionInterval: data.dataTransmissionInterval,
        vehicleId: vehicle.id, 
      };

      console.log("Submitting device with payload:", payload); // Debug log

      await vehicleService.addDeviceToVehicle(payload);
      toast.success("Device added to vehicle successfully");
      setSubmitSuccess(true);
      onDeviceAdded?.();

      // Close sheet after a brief delay to show success state
      setTimeout(() => {
        onOpenChange(false);
        setSubmitSuccess(false);
      }, 1000);
    } catch (error: any) {
      console.error("Error adding device:", error); // Debug log
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to add device";
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset form and states when closing
        form.reset();
        setSubmitError(null);
        setSubmitSuccess(false);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[600px]" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Add Device to Vehicle
          </SheetTitle>
          <SheetDescription>
            {vehicle
              ? `Add a new tracking device to vehicle ${vehicle.plateNumber}`
              : "Loading..."}
          </SheetDescription>
        </SheetHeader>

        {/* Error Alert */}
        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {submitSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Device added successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Vehicle Info Display - Auto-filled */}
              {vehicle && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">Target Vehicle:</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Plate:</strong> {vehicle.plateNumber} |{" "}
                    <strong>Model:</strong> {vehicle.vehicleModel} |{" "}
                    <strong>Owner:</strong>{" "}
                    {vehicle.user?.username || "Not assigned"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vehicle ID: {vehicle.id} | User ID:{" "}
                    {vehicle.user?.id || "N/A"}
                  </p>
                </div>
              )}

              {/* Serial Number */}
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.serialNumber
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Serial Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., RAA1011B"
                        className={
                          form.formState.errors.serialNumber
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.model ? "text-destructive" : ""
                      }
                    >
                      Model *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., GT-2000"
                        className={
                          form.formState.errors.model
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.type ? "text-destructive" : ""
                      }
                    >
                      Type *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., GPS, OBD, FUEL_SENSOR"
                        className={
                          form.formState.errors.type ? "border-destructive" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device Category - Using your Prisma enum */}
              <FormField
                control={form.control}
                name="deviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.deviceCategory
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Device Category *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            form.formState.errors.deviceCategory
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          <SelectItem value="CAR">Car</SelectItem>
                          <SelectItem value="TRUCK">Truck</SelectItem>
                          <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                          <SelectItem value="TRICYCLE">Tricycle</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Communication Protocol - Using your Prisma enum */}
              <FormField
                control={form.control}
                name="communicationProtocol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.communicationProtocol
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Communication Protocol *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            form.formState.errors.communicationProtocol
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Protocols</SelectLabel>
                          <SelectItem value="MQTT">MQTT</SelectItem>
                          <SelectItem value="HTTP">HTTP</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data Transmission Interval */}
              <FormField
                control={form.control}
                name="dataTransmissionInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.dataTransmissionInterval
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Data Transmission Interval *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., 30s, 1m, 5m"
                        className={
                          form.formState.errors.dataTransmissionInterval
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Firmware Version */}
              <FormField
                control={form.control}
                name="firmwareVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmware Version</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., 2.3.1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SIM Card Number */}
              <FormField
                control={form.control}
                name="simCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIM Card Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., 250783456789"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Installation Date */}
              <FormField
                control={form.control}
                name="installationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-4 flex justify-between gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="flex-1"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitSuccess && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {isSubmitting
                  ? "Adding Device..."
                  : submitSuccess
                  ? "Success!"
                  : "Add Device"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
            </SheetFooter>

            {/* Form validation summary */}
            {hasErrors && (
              <div className="mt-2 text-sm text-destructive">
                Please fix the errors above before submitting.
              </div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
