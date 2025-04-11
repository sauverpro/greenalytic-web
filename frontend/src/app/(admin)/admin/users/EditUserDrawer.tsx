import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { User } from "@/types/types";
import UserForm from "./userform";

export default function EditUserDrawer({
  open,
  onOpenChange,
  user,
  refetchUsers,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  refetchUsers: () => void;
}) {
  if (!user) return null;
  const handleSuccess = () => {
    refetchUsers();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="right-0 left-auto h-full w-full sm:w-96 flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Edit User</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto w-full max-w-sm p-4">
          <UserForm user={user} onSubmit={handleSuccess} />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
