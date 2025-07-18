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
import { FuelType } from "@/types/EnumTypes";
import vehicleService from "../services";
import type {
  VehicleCreateRequest,
  VehicleUpdateRequest,
  VehicleFullDetails,
} from "../VehicleTypes";

interface UpdateAndAddVehicleProps {
  vehicleId?: number;
  isEditing?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onVehicleCreated?: () => void;
  onVehicleUpdated?: () => void;
}

const vehicleSchema = z.object({
  plateNumber: z.string().min(3, "Plate number is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  fuelType: z.nativeEnum(FuelType, {
    errorMap: () => ({ message: "Fuel type is required and must be valid" }),
  }),
  registrationNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  yearOfManufacture: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .min(1900, "Too old")
    .max(new Date().getFullYear(), "Future years not allowed"),
  usage: z.string().min(1, "Usage is required"),
  userId: z.number().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export function UpdateAndAddVehicleSheet({
  vehicleId,
  isEditing = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onVehicleCreated,
  onVehicleUpdated,
}: UpdateAndAddVehicleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: "",
      vehicleModel: "",
      vehicleType: "",
      fuelType: undefined,
      registrationNumber: "",
      chassisNumber: "",
      yearOfManufacture: new Date().getFullYear(),
      usage: "",
      userId: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const isFormDisabled = isSubmitting || loadingVehicle;

  // Fetch vehicle data when editing
  useEffect(() => {
    const fetchVehicle = async () => {
      if (isEditing && vehicleId && open) {
        setLoadingVehicle(true);
        setSubmitError(null);
        try {
          const data: VehicleFullDetails = await vehicleService.getVehicleById(
            vehicleId
          );
          form.reset({
            plateNumber: data.plateNumber,
            vehicleModel: data.vehicleModel,
            vehicleType: data.vehicleType,
            fuelType: data.fuelType,
            registrationNumber: data.registrationNumber || "",
            chassisNumber: data.chassisNumber || "",
            yearOfManufacture: data.yearOfManufacture,
            usage: data.usage,
            userId: data.user?.id || undefined,
          });
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.message ||
            error.message ||
            "Failed to fetch vehicle info";
          setSubmitError(errorMsg);
          toast.error(errorMsg);
        } finally {
          setLoadingVehicle(false);
        }
      }
    };

    fetchVehicle();
  }, [vehicleId, isEditing, open, form]);

  const onSubmit = async (data: VehicleFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (isEditing && vehicleId) {
        const payload: VehicleUpdateRequest = { ...data };
        await vehicleService.updateVehicle(vehicleId, payload);
        toast.success("Vehicle updated successfully");
        setSubmitSuccess(true);
        onVehicleUpdated?.();
      } else {
        const payload: VehicleCreateRequest = {
          ...data,
          userId: data.userId || 1,
        };
        await vehicleService.createVehicle(payload);
        toast.success("Vehicle created successfully");
        setSubmitSuccess(true);
        onVehicleCreated?.();
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
      {isEditing ? "Edit Vehicle" : "+ Add New"}
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
          <SheetTitle>
            {isEditing ? "Edit Vehicle" : "Create Vehicle"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the vehicle information."
              : "Fill in the new vehicle details."}
          </SheetDescription>
        </SheetHeader>

        {/* Loading State */}
        {loadingVehicle && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading vehicle data...</span>
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
              Vehicle {isEditing ? "updated" : "created"} successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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

              {/* Vehicle Model */}
              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.vehicleModel
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Vehicle Model *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isFormDisabled}
                        className={
                          form.formState.errors.vehicleModel
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vehicle Type */}
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.vehicleType
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Vehicle Type *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isFormDisabled}
                        className={
                          form.formState.errors.vehicleType
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fuel Type */}
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.fuelType ? "text-destructive" : ""
                      }
                    >
                      Fuel Type *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isFormDisabled}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            form.formState.errors.fuelType
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fuel Types</SelectLabel>
                          {Object.values(FuelType).map((fuelType) => (
                            <SelectItem key={fuelType} value={fuelType}>
                              {fuelType.charAt(0) +
                                fuelType.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Registration Number */}
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isFormDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chassis Number */}
              <FormField
                control={form.control}
                name="chassisNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chassis Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isFormDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year of Manufacture */}
              <FormField
                control={form.control}
                name="yearOfManufacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.yearOfManufacture
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Year of Manufacture *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={isFormDisabled}
                        className={
                          form.formState.errors.yearOfManufacture
                            ? "border-destructive"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Usage */}
              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        form.formState.errors.usage ? "text-destructive" : ""
                      }
                    >
                      Usage *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isFormDisabled}
                        className={
                          form.formState.errors.usage
                            ? "border-destructive"
                            : ""
                        }
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
                  ? "Update Vehicle"
                  : "Save Vehicle"}
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
