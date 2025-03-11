"use client";

import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { User } from "@/types/types";
import UserForm from "./userform";


export default function EditUserDrawer({
  open,
  onOpenChange,
  user,
  refetchUsers
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  refetchUsers: () => void;
}) {
  if (!user) return null; // Don't render if no user is selected

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="left-0 right-auto h-full w-full sm:w-96 flex flex-col">
        <div className="mx-auto w-full max-w-sm p-4">
          <UserForm
            user={user}
            onSubmit={() => {
              refetchUsers();
              onOpenChange(false); // Close drawer after update
            }}
          />
          <DrawerClose asChild>
            <button className="mt-4 w-full text-center text-sm text-gray-500">
              Close
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
