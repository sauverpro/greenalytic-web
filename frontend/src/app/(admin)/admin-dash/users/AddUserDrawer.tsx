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
  DrawerTitle
} from "@/components/ui/drawer";
import { signup, getUserById } from "@/api/services/userService"; // Ensure you import getUserById
import { User } from "@/types/types"; // Import User type

export default function AddUserDrawer({
  open,
  onOpenChange,
  addUserToState // This will be passed down from UserTable
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addUserToState: (newUser: User) => void; // Function to add the new user to the existing list
}) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Signup the new user
      const response = await signup(userData);

      // Fetch the user by ID after creation
      const newUserReponse = await getUserById(response.userInformation.id); // Assuming `response.user.id` is available
      addUserToState(newUserReponse.user); // Add user to the existing state in UserTable
console.log(newUserReponse.user);
      // Close the drawer
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
      <DrawerContent className="right-0 left-auto h-full w-full sm:w-96 flex flex-col">
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
            <Button onClick={handleSubmit} disabled={loading}>
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
