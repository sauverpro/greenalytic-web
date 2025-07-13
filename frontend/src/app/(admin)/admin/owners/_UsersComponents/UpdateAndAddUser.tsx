"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { GetUserByIdResponse, User, UserRole, UserStatus } from "@/types";
import { useDynamicCrud } from "@/hooks/use-dynamic-crud";

// Validation schema
const userSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  nationalId: z.string().min(1, "National ID is required"),
  gender: z.string().min(1, "Gender is required"),
  location: z.string().min(1, "Location is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyRegistrationNumber: z.string().min(1, "Company registration number is required"),
  businessSector: z.string().min(1, "Business sector is required"),
  fleetSize: z.string().min(1, "Fleet size is required"),
  language: z.string().default("English"),
  notificationPreference: z.string().default("Email"),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus)
});

type UserFormData = z.infer<typeof userSchema>;

// Extended User type to include all form fields
interface ExtendedUser extends User {
  nationalId?: string;
  gender?: string;
  location?: string;
  companyRegistrationNumber?: string;
  businessSector?: string;
  fleetSize?: number;
  language?: string;
  notificationPreference?: string;
}

interface UpdateAndAddUserProps {
  onUserCreated?: () => void;
  initialData?: GetUserByIdResponse; 
  isEditing?: boolean;
}

export function UpdateAndAddUserSheet({ onUserCreated, initialData, isEditing = false }: UpdateAndAddUserProps) {
  const [open, setOpen] = useState(false);
  const { createData, updateData } = useDynamicCrud<User>();
  const createMutation = createData('/users', 'users');
  const updateMutation = updateData('/users', 'users');

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: initialData?.email || "",
      username: initialData?.username || "",
      password: "",
      phoneNumber: initialData?.phoneNumber || "",
      nationalId: initialData?.nationalId || "",
      gender: initialData?.gender || "",
      location: initialData?.location || "",
      companyName: initialData?.companyName || "",
      companyRegistrationNumber: initialData?.companyRegistrationNumber || "",
      businessSector: initialData?.businessSector || "",
      fleetSize: initialData?.fleetSize?.toString() || "",
      language: initialData?.language || "English",
      notificationPreference: initialData?.notificationPreference || "Email",
      role: initialData?.role || UserRole.USER,
      status: initialData?.status || UserStatus.PENDING_APPROVAL
    }
  });

  const onSubmit = async (data: UserFormData) => {
    const payload = {
      ...data,
      fleetSize: data.fleetSize ? parseInt(data.fleetSize) : null
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: payload
        });
        toast.success("User updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("User created successfully");
      }
      
      setOpen(false);
      form.reset();
      onUserCreated?.(); // Call callback if provided
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditing ? 'update' : 'create'} user`;
      toast.error(errorMessage);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          {isEditing ? "Edit User" : "+ Add New"}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit User" : "Create User"}</SheetTitle>
          <SheetDescription>
            Fill out all required user details.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              {!isEditing&&(
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />)}

              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* National ID Field */}
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter national ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter gender" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Name Field */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Registration Number Field */}
              <FormField
                control={form.control}
                name="companyRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Registration Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter registration number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Sector Field */}
              <FormField
                control={form.control}
                name="businessSector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Sector *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business sector" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fleet Size Field */}
              <FormField
                control={form.control}
                name="fleetSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fleet Size *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter fleet size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language Field */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter language" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notification Preference Field */}
              <FormField
                control={form.control}
                name="notificationPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Preference</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter notification preference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Select */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserRole).map(role => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Select */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserStatus).map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-4 flex justify-between">
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting 
                  ? (isEditing ? "Updating..." : "Saving...") 
                  : (isEditing ? "Update User" : "Save User")
                }
              </Button>
              <SheetClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}