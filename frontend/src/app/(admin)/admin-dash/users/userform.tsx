"use client";
import { useState, useEffect } from "react";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/api/services/userService";

type UserFormProps = {
  user: User;
  onSubmit: (userData: User) => void;
  isNewUser?: boolean;
};

const UserForm = ({ user, onSubmit, isNewUser = false }: UserFormProps) => {
  const [userData, setUserData] = useState<User>({
    id: user.id,
    username: user.username || "",
    email: user.email || "",
    image: user.image || "",
    gender: user.gender || "",
    role: user.role || "USER",
    phoneNumber: user.phoneNumber || "",
 
    deletedAt: user.deletedAt || undefined,
    createdAt: user.createdAt || new Date(),
    updatedAt: new Date(),
    vehicles: user.vehicles || [],
    trackingDevices: user.trackingDevices || []
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value || undefined
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isNewUser) {
        // For new users, just pass the data to the parent component
        onSubmit(userData);
      } else {
        // For existing users, update via API then call onSubmit
        await updateUser(userData.id.toString(), userData);
        onSubmit(userData);
      }
    } catch (error) {
      console.error("Failed to submit user data", error);
    }
  };

  // Add password field only for new users
  const formFields = [
    { name: "username", label: "Username", type: "text" },
    { name: "email", label: "Email", type: "email" },
    ...(isNewUser
      ? [{ name: "password", label: "Password", type: "password" }]
      : []),
    { name: "image", label: "Profile Image URL", type: "text" },
    { name: "phoneNumber", label: "Phone Number", type: "text" }
  ];

  return (
    <div className="space-y-4">
      {!isNewUser && <h2 className="text-lg font-bold mb-4">Edit User</h2>}
      <div className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={userData[field.name as keyof typeof userData] as string}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        {/* Gender Selection */}
        <div>
          <label className="block text-sm mb-1">Gender</label>
          <select
            name="gender"
            value={userData.gender || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded">
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        {!isNewUser && (
          <Button onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserForm;
