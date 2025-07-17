"use client";

import { useEffect, useState } from "react";
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
  SheetTrigger,
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
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  createTrackingDevice,
  updateTrackingDevice,
  getTrackingDeviceById,
  type TrackingDeviceCreateDTO,
  type TrackingDeviceUpdateDTO,
} from "@/services/trackingDeviceService";
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes";

interface UpdateAndAddDeviceProps {
  deviceId?: number;
  isEditing?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDeviceCreated?: () => void;
  onDeviceUpdated?: () => void;
}

const deviceSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  deviceCategory: z.string().min(1, "Device category is required"),
  firmwareVersion: z.string().optional(),
  simCardNumber: z.string().optional(),
  communicationProtocol: z
    .string()
    .min(1, "Communication protocol is required"),
  dataTransmissionInterval: z
    .string()
    .min(1, "Data transmission interval is required"),
  userId: z.number().optional(),
  vehicleId: z.number().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

export function UpdateAndAddDeviceSheet({
  deviceId,
  isEditing = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onDeviceCreated,
  onDeviceUpdated,
}: UpdateAndAddDeviceProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      serialNumber: "",
      model: "",
      type: "",
      plateNumber: "",
      deviceCategory: "",
      firmwareVersion: "",
      simCardNumber: "",
      communicationProtocol: "",
      dataTransmissionInterval: "",
      userId: undefined,
      vehicleId: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const isFormDisabled = isSubmitting || loadingDevice;

  // Fetch device data when editing
  useEffect(() => {
    const fetchDevice = async () => {
      if (isEditing && deviceId && open) {
        setLoadingDevice(true);
        setSubmitError(null);
        try {
          const data: TrackingDeviceListItem = await getTrackingDeviceById(
            deviceId
          );
          form.reset({
            serialNumber: data.serialNumber,
            model: data.model,
            type: data.type,
            plateNumber: data.plateNumber,
            deviceCategory: data.deviceCategory,
            firmwareVersion: data.firmwareVersion || "",
            simCardNumber: data.simCardNumber || "",
            communicationProtocol: data.communicationProtocol,
            dataTransmissionInterval: data.dataTransmissionInterval,
            userId: data.userId || undefined,
            vehicleId: data.vehicleId || undefined,
          });
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.message ||
            error.message ||
            "Failed to fetch device info";
          setSubmitError(errorMsg);
          toast.error(errorMsg);
        } finally {
          setLoadingDevice(false);
        }
      }
    };

    fetchDevice();
  }, [deviceId, isEditing, open, form]);

  const onSubmit = async (data: DeviceFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (isEditing && deviceId) {
        const payload: TrackingDeviceUpdateDTO = { ...data };
        await updateTrackingDevice(deviceId, payload);
        toast.success("Device updated successfully");
        setSubmitSuccess(true);
        onDeviceUpdated?.();
      } else {
        const payload: TrackingDeviceCreateDTO = { ...data };
        await createTrackingDevice(payload);
        toast.success("Device created successfully");
        setSubmitSuccess(true);
        onDeviceCreated?.();
      }

      // Close sheet after a brief delay to show success state
      setTimeout(() => {
        setOpen(false);
        setSubmitSuccess(false);
      }, 1000);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form and states when closing
        form.reset();
        setSubmitError(null);
        setSubmitSuccess(false);
      }
    }
  };

  const TriggerButton = () => (
    <Button size="sm" disabled={isSubmitting}>
      {isEditing ? "Edit Device" : "+ Add New"}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {!controlledOpen && (
        <SheetTrigger asChild>
          <TriggerButton />
        </SheetTrigger>
      )}

      <SheetContent className="sm:max-w-[600px]" side="left">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Device" : "Create Device"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the device information."
              : "Fill in the new device details."}
          </SheetDescription>
        </SheetHeader>

        {/* Loading State */}
        {loadingDevice && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading device data...</span>
          </div>
        )}

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
              Device {isEditing ? "updated" : "created"} successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
                        disabled={isFormDisabled}
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
                        disabled={isFormDisabled}
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
                        disabled={isFormDisabled}
                        className={
                          form.formState.errors.type ? "border-destructive" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plate Number */}
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.plateNumber
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Plate Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isFormDisabled}
                        className={
                          form.formState.errors.plateNumber
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device Category */}
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
                      disabled={isFormDisabled}
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
                          <SelectLabel>Device Categories</SelectLabel>
                          <SelectItem value="GPS_TRACKER">
                            GPS Tracker
                          </SelectItem>
                          <SelectItem value="OBD_DEVICE">OBD Device</SelectItem>
                          <SelectItem value="FUEL_SENSOR">
                            Fuel Sensor
                          </SelectItem>
                          <SelectItem value="EMISSION_MONITOR">
                            Emission Monitor
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Communication Protocol */}
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
                      disabled={isFormDisabled}
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
                          <SelectItem value="HTTP">HTTP</SelectItem>
                          <SelectItem value="MQTT">MQTT</SelectItem>
                          <SelectItem value="TCP">TCP</SelectItem>
                          <SelectItem value="UDP">UDP</SelectItem>
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
                        placeholder="e.g., 30s, 1m, 5m"
                        disabled={isFormDisabled}
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
                      <Input {...field} disabled={isFormDisabled} />
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
                      <Input {...field} disabled={isFormDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-4 flex justify-between gap-2">
              <Button
                type="submit"
                disabled={isFormDisabled || submitSuccess}
                className="flex-1"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitSuccess && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : submitSuccess
                  ? "Success!"
                  : isEditing
                  ? "Update Device"
                  : "Save Device"}
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
