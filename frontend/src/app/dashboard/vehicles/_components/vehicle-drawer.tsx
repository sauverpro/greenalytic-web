"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Drawer } from "vaul"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, Car } from "lucide-react"
import { FuelType } from "@/types/EnumTypes"

import { toast } from "sonner"
import vehicleService from "../../vehicles/services"

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
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface SimpleVehicleDrawerProps {
  isEdit?: boolean
  vehicleId?: number
  userId?: number
  triggerClassName?: string
  triggerText?: string
}

export default function VehicleDrawer({
  isEdit,
  vehicleId,
  userId,
  triggerClassName,
  triggerText,
}: SimpleVehicleDrawerProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [loadingVehicle, setLoadingVehicle] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
    },
  })

  const isSubmitting = form.formState.isSubmitting
  const hasErrors = Object.keys(form.formState.errors).length > 0

  // Load vehicle data when drawer opens and it's edit mode
  useEffect(() => {
    if (isEdit && vehicleId && isOpen) {
      setLoadingVehicle(true)
      setSubmitError(null)
      vehicleService
        .getVehicleById(vehicleId)
        .then((data) => {
          form.reset({
            ...data,
            yearOfManufacture: data.yearOfManufacture || new Date().getFullYear(),
          })
        })
        .catch((error) => {
          const msg = error?.response?.data?.message || error.message || "Failed to load vehicle data"
          setSubmitError(msg)
          toast.error(msg)
        })
        .finally(() => setLoadingVehicle(false))
    }
  }, [isEdit, vehicleId, isOpen, form])

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      form.reset()
      setSubmitError(null)
      setSubmitSuccess(false)
    }
  }, [isOpen, form])

  const onSubmit = async (data: VehicleFormData) => {
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      const payload = {
        ...data,
        // fuelType is already a valid FuelType enum value
      }
      if (isEdit && vehicleId) {
        await vehicleService.updateVehicle(vehicleId, payload)
        toast.success("Vehicle updated")
      } else if (userId) {
        await vehicleService.createVehicle({ ...payload, userId })
        toast.success("Vehicle created")
      }
      setSubmitSuccess(true)
      setTimeout(() => {
        setIsOpen(false) // Close drawer after success
      }, 1000)
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Submit failed"
      setSubmitError(msg)
      toast.error(msg)
    }
  }

  return (
    <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger
        className={
          triggerClassName ||
          "h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        }
      >
        {triggerText ? triggerText : <Car className="h-4 w-4" />}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="left-2 top-2 bottom-2 fixed z-50 outline-none w-[380px] flex"
          style={{ "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties}
        >
          <div className="bg-white h-full w-full grow p-6 flex flex-col rounded-lg">
            <div className="space-y-4">
              <Drawer.Title className="text-lg font-semibold">
                {isEdit ? "Edit Vehicle" : "Create Vehicle"}
              </Drawer.Title>

              {/* LOADING */}
              {loadingVehicle && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading vehicle info...</span>
                </div>
              )}

              {/* ERROR */}
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              {/* SUCCESS */}
              {submitSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Vehicle {isEdit ? "updated" : "created"} successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                  {[ 
                    ["plateNumber", "Plate Number"],
                    ["vehicleModel", "Vehicle Model"],
                    ["vehicleType", "Vehicle Type"],
                    ["registrationNumber", "Registration Number"],
                    ["chassisNumber", "Chassis Number"],
                    ["usage", "Usage"],
                  ].map(([name, label]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof VehicleFormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={form.formState.errors[name as keyof VehicleFormData] ? "text-destructive" : ""}
                          >
                            {label} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isSubmitting || loadingVehicle}
                              className={
                                form.formState.errors[name as keyof VehicleFormData] ? "border-destructive" : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  {/* fuelType dropdown */}
                            <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={form.formState.errors.fuelType ? "text-destructive" : ""}>
                          Fuel Type *
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isSubmitting || loadingVehicle}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className={form.formState.errors.fuelType ? "border-destructive" : ""}>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(FuelType).map((fuelType) => (
                                <SelectItem key={fuelType} value={fuelType}>
                                  {fuelType.charAt(0) + fuelType.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <FormLabel className={form.formState.errors.yearOfManufacture ? "text-destructive" : ""}>
                          Year of Manufacture *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            disabled={isSubmitting || loadingVehicle}
                            className={form.formState.errors.yearOfManufacture ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting || loadingVehicle || submitSuccess}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {submitSuccess && <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {isSubmitting
                        ? isEdit
                          ? "Updating..."
                          : "Saving..."
                        : submitSuccess
                        ? "Success!"
                        : isEdit
                        ? "Update"
                        : "Create"}
                    </Button>
                    <Drawer.Close asChild>
                      <Button type="button" variant="outline" disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </Drawer.Close>
                  </div>

                  {hasErrors && (
                    <div className="text-sm text-destructive mt-2">Please fix the errors above before submitting.</div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
