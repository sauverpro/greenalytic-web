"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { signup, getUserById } from "../../../../../services/userService";  
import { User } from "@/types/types";  

export default function AddUserDrawer({
  open,
  onOpenChange,
  addUserToState,  
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addUserToState: (newUser: User) => void;  
}) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
       
      const response: {
        success: boolean;
        message: string;
        userInformation?: { id: string };
      } = await signup(userData);

      if (response.success && response.userInformation) {
         
        const newUserResponse = await getUserById(response.userInformation.id);  
        addUserToState(newUserResponse.user);  
        console.log(newUserResponse.user);
      } else {
        setError(`Failed to add user. ${response.message}`);
      }
       
      onOpenChange(false);
    } catch (error) {
      setError(`Failed to add user. Try again. ${error}`);
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="right-0 top-[-3rem] left-auto h-fit w-full sm:w-96 flex flex-col rounded-md">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add New User</DrawerTitle>
            <DrawerDescription>Fill in the user details.</DrawerDescription>
          </DrawerHeader>

          {/* Form Inputs */}
          <div className="p-4 pb-0 space-y-4">
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
            <select
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
            />

            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Drawer Footer */}
          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={loading} className="text-white bg-primary">
              {loading ? "Adding..." : "Add User"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
