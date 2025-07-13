"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDynamicCrud } from "@/lib/hooks/use-dynamic-crud";
import { GetUserByIdResponse, User } from "@/types";
import { toast } from "sonner";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteUserDialogProps {
  user: GetUserByIdResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onDeleted,
}: DeleteUserDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionType, setDeletionType] = useState<"soft" | "hard">("soft");

  const { softDeleteData, hardDeleteData } = useDynamicCrud<User>();
  const deleteMutation =
    deletionType === "hard"
      ? hardDeleteData("/users", "users")
      : softDeleteData("/users", "users");

  const handleDelete = async () => {
    if (confirmText !== user.username) {
      toast.error("Please type the username correctly to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success(`User ${deletionType === "hard" ? "hard-deleted" : "soft-deleted"} successfully`);
      onDeleted?.();
      onOpenChange(false);
      setConfirmText("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to delete user";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  const isConfirmValid = confirmText === user.username;
  const hasActivity =
    user._count &&
    (user._count.vehicles > 0 ||
      user._count.trackingDevices > 0 ||
      user._count.alerts > 0 ||
      user._count.reports > 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {deletionType === "hard" ? "Hard Delete User" : "Soft Delete User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deletionType === "hard"
              ? "This will permanently and irreversibly delete this user and all related data."
              : "This will deactivate the user without permanently removing data."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Toggle Deletion Type */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setDeletionType((prev) => (prev === "soft" ? "hard" : "soft"))
              }
              className="text-xs"
            >
              Switch to {deletionType === "soft" ? "Hard" : "Soft"} Delete
            </Button>
          </div>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg">User to be deleted:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Username:</span> {user.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Company:</span> {user.companyName}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {user.role}
                </div>
              </div>
            </CardContent>
          </Card>

          {hasActivity && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Warning: User has active data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-800 mb-3">
                  This user has associated data that will also be affected:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {user._count?.vehicles > 0 && <div>• {user._count.vehicles} vehicles</div>}
                  {user._count?.trackingDevices > 0 && (
                    <div>• {user._count.trackingDevices} tracking devices</div>
                  )}
                  {user._count?.alerts > 0 && <div>• {user._count.alerts} alerts</div>}
                  {user._count?.reports > 0 && <div>• {user._count.reports} reports</div>}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirm-username">
              Type <span className="font-mono font-bold">{user.username}</span> to confirm deletion:
            </Label>
            <Input
              id="confirm-username"
              type="text"
              placeholder={user.username}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`${
                confirmText && !isConfirmValid
                  ? "border-red-300 focus:border-red-500"
                  : isConfirmValid
                  ? "border-green-300 focus:border-green-500"
                  : ""
              }`}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-sm text-red-600">Username does not match</p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
