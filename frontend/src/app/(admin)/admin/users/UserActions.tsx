"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { User } from "@/types/types";
import Link from "next/link";

interface UserActionsProps {
  user: User;
  onEditUser: (user: User) => void;
  onAddVehicle: (userId: string) => void;
  onViewUser: (user: User) => void;
  refetchUsers: () => void;
}

const UserActions = ({
  user,
  onEditUser,
  onAddVehicle,
  onViewUser,
  refetchUsers,
}: UserActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/${user.id}`}>Manage user</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditUser(user)}>
          Edit Client
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;

