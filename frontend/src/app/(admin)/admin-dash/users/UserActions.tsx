
// 3. UserActions component (UserActions.tsx)
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCog, Plus, ChevronDown } from "lucide-react";
import { DeleteUserDialog } from "./deleteUserDialog";
import { User } from "@/types/types";

interface UserActionsProps {
  user: User;
  onEditUser: (user: User) => void;
  onAddVehicle: (userId: string) => void;
  refetchUsers: () => void;
}

const UserActions = ({
  user,
  onEditUser,
  onAddVehicle,
  refetchUsers
}: UserActionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 bg-white">
          Actions <ChevronDown size={14} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          onClick={() => onEditUser(user)}
          className="flex items-center gap-2 cursor-pointer">
          <UserCog size={14} />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onAddVehicle(user.id.toString())}
          className="flex items-center gap-2 cursor-pointer">
          <Plus size={14} />
          Add Vehicle
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
          asChild>
          <DeleteUserDialog
            userId={user.id.toString()}
            refetchUsers={refetchUsers}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;