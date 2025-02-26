
"use client";
import { useState } from "react";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/services/userService";

const UserForm = ({ user, onSubmit }: { user: User; onSubmit: () => void }) => {
  const [userData, setUserData] = useState<User>({
    id: user.id,
    username: user.username || "",
    email: user.email,
    image: user.image || "",
    gender: user.gender || "",
    role: user.role,
    phoneNumber: user.phoneNumber || "",
    deletedAt: user.deletedAt || undefined,
    createdAt: user.createdAt,
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
      await updateUser(userData.id.toString(), userData);
      onSubmit();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold mb-4">Edit User</h2>
      <div className="space-y-4">
        {[
          { name: "username", label: "Username", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "image", label: "Profile Image URL", type: "text" },
          { name: "phoneNumber", label: "Phone Number", type: "text" }
        ].map((field) => (
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

        <Button onClick={handleSubmit} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UserForm;
