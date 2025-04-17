"use client";
import { useState } from "react";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { updateUser } from "../../../../../services/userService";

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
    password: "", // Add password field for new users
    deletedAt: user.deletedAt || undefined,
    createdAt: user.createdAt || new Date(),
    updatedAt: new Date(),
    vehicles: user.vehicles || [],
    trackingDevices: user.trackingDevices || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isNewUser) {
        // For new users, just pass the data to the parent component
        onSubmit(userData);
      } else {
        // For existing users, update via API then call onSubmit
        await updateUser(userData.id.toString(), userData);
        onSubmit(userData);
      }
    } catch (error: any) {
      setError(`Failed to submit user data: ${error.message || error}`);
      console.error("Failed to submit user data", error);
    } finally {
      setLoading(false);
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
    { name: "phoneNumber", label: "Phone Number", type: "text" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={userData[field.name as keyof typeof userData] as string}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
          >
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
          >
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          onClick={handleSubmit}
          className="user-form-submit w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : isNewUser ? "Add User" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;
