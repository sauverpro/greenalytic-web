"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { UserRole, UserStatus, type UserCreateDTO, type UserUpdateDTO, type GetUserByIdResponse } from "@/types"
import { createUser, updateUser, getUserById } from "../_UserActions/actions"



interface UpdateAndAddUserProps {
  userId?: number
  isEditing?: boolean
  onUserCreated?: () => void
}

export function UpdateAndAddUserSheet({ userId, isEditing = false, onUserCreated }: UpdateAndAddUserProps) {
  
  const userSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
  password: isEditing
    ? z.string().optional() // no validation if editing
    : z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  nationalId: z.string().min(1, "National ID is required"),
  gender: z.string().min(1, "Gender is required"),
  location: z.string().min(1, "Location is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyRegistrationNumber: z.string().min(1, "Company registration number is required"),
  businessSector: z.string().min(1, "Business sector is required"),
  fleetSize: z.number().min(1, "Fleet size must be at least 1"),
  language: z.string().default("English"),
  notificationPreference: z.string().default("Email"),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
})

type UserFormData = z.infer<typeof userSchema>
  const [open, setOpen] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      phoneNumber: "",
      nationalId: "",
      gender: "",
      location: "",
      companyName: "",
      companyRegistrationNumber: "",
      businessSector: "",
      fleetSize: 0,
      language: "English",
      notificationPreference: "Email",
      role: UserRole.USER,
      status: UserStatus.PENDING_APPROVAL,
    },
  })

  const isSubmitting = form.formState.isSubmitting
  const hasErrors = Object.keys(form.formState.errors).length > 0
  const isFormDisabled = isSubmitting || loadingUser

  // Fetch user data when editing
  useEffect(() => {
    const fetchUser = async () => {
      if (isEditing && userId && open) {
        setLoadingUser(true)
        setSubmitError(null)
        try {
          const data: GetUserByIdResponse = await getUserById(userId)
          form.reset({
            email: data.email,
            username: data.username || "",
            password: "", // leave blank on edit
            phoneNumber: data.phoneNumber || "",
            nationalId: data.nationalId,
            gender: data.gender || "",
            location: data.location || "",
            companyName: data.companyName || "",
            companyRegistrationNumber: data.companyRegistrationNumber,
            businessSector: data.businessSector,
            fleetSize: data.fleetSize,
            language: data.language,
            notificationPreference: data.notificationPreference,
            role: data.role,
            status: data.status,
          })
        } catch (error: any) {
          const errorMsg = error?.response?.data?.message || error.message || "Failed to fetch user info"
          setSubmitError(errorMsg)
          toast.error(errorMsg)
        } finally {
          setLoadingUser(false)
        }
      }
    }

    fetchUser()
  }, [userId, isEditing, open, form])

  const onSubmit = async (data: UserFormData) => {
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      if (isEditing && userId) {
        const payload: UserUpdateDTO = { ...data }
        await updateUser(userId, payload)
        toast.success("User updated successfully")
        setSubmitSuccess(true)
      } else {
        const payload: UserCreateDTO = { ...data }
        await createUser(payload)
        toast.success("User created successfully")
        setSubmitSuccess(true)
      }

      // Close sheet after a brief delay to show success state
      setTimeout(() => {
        setOpen(false)
        setSubmitSuccess(false)
        onUserCreated?.()
      }, 1000)
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || "An error occurred"
      setSubmitError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen)
      if (!newOpen) {
        // Reset form and states when closing
        form.reset()
        setSubmitError(null)
        setSubmitSuccess(false)
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" disabled={isSubmitting}>
          {isEditing ? "Edit User" : "+ Add New"}
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[600px]" side="left">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit User" : "Create User"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the user information." : "Fill in the new user details."}
          </SheetDescription>
        </SheetHeader>

        {/* Loading State */}
        {loadingUser && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading user data...</span>
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
              User {isEditing ? "updated" : "created"} successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {[
                ["email", "Email", "email"],
                ["username", "Username", "text"],
                ...(isEditing ? [] : [["password", "Password", "password"]]),
                ["phoneNumber", "Phone Number", "text"],
                ["nationalId", "National ID", "text"],
                ["gender", "Gender", "text"],
                ["location", "Location", "text"],
                ["companyName", "Company Name", "text"],
                ["companyRegistrationNumber", "Company Registration Number", "text"],
                ["businessSector", "Business Sector", "text"],
                ["language", "Language", "text"],
                ["notificationPreference", "Notification Preference", "text"],
              ].map(([name, label, type]) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof UserFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={form.formState.errors[name as keyof UserFormData] ? "text-destructive" : ""}
                      >
                        {label} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={type}
                          {...field}
                          disabled={isFormDisabled}
                          className={form.formState.errors[name as keyof UserFormData] ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Fleet Size */}
              <FormField
                control={form.control}
                name="fleetSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={form.formState.errors.fleetSize ? "text-destructive" : ""}>
                      Fleet Size *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={isFormDisabled}
                        className={form.formState.errors.fleetSize ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={form.formState.errors.role ? "text-destructive" : ""}>Role *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isFormDisabled}>
                      <FormControl>
                        <SelectTrigger className={form.formState.errors.role ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>User Roles</SelectLabel>
                          {Object.values(UserRole).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={form.formState.errors.status ? "text-destructive" : ""}>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isFormDisabled}>
                      <FormControl>
                        <SelectTrigger className={form.formState.errors.status ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>User Status</SelectLabel>
                          {Object.values(UserStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-4 flex justify-between gap-2">
              <Button type="submit" disabled={isFormDisabled || submitSuccess} className="flex-1">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitSuccess && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : submitSuccess
                    ? "Success!"
                    : isEditing
                      ? "Update User"
                      : "Save User"}
              </Button>

              <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
            </SheetFooter>

            {/* Form validation summary */}
            {hasErrors && (
              <div className="mt-2 text-sm text-destructive">Please fix the errors above before submitting.</div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
