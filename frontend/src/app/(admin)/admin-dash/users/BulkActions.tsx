

"use client";
// 7. BulkActions component (BulkActions.tsx)
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserCog } from "lucide-react";
import { GridRowSelectionModel } from "@mui/x-data-grid";

interface BulkActionsProps {
  selectionModel: GridRowSelectionModel;
  fetchUsers: Function;
  pagination: { currentPage: number; limit: number };
}

const BulkActions = ({
  selectionModel,
  fetchUsers,
  pagination
}: BulkActionsProps) => {
  const handleBulkAction = (action: string) => {
    if (selectionModel.length === 0) return;

    switch (action) {
      case "delete":
        if (
          confirm(
            `Are you sure you want to delete ${selectionModel.length} selected users?`
          )
        ) {
          // Implement bulk delete logic here
          console.log(`Deleting users with IDs: ${selectionModel.join(", ")}`);
          // After successful API call:
          // Call fetchUsers to refresh the data
          fetchUsers(pagination.currentPage, pagination.limit);
        }
        break;
      case "changeRole":
        // Implement change role logic
        console.log(
          `Changing role for users with IDs: ${selectionModel.join(", ")}`
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
        {selectionModel.length} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleBulkAction("delete")}
        className="flex items-center gap-1 h-9 bg-white">
        <Trash2 size={14} />
        Delete
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleBulkAction("changeRole")}
        className="flex items-center gap-1 h-9 bg-white">
        <UserCog size={14} />
        Change Role
      </Button>
    </div>
  );
};

export default BulkActions;
