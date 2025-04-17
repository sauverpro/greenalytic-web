"use client";

import { Users, Edit, Eye, Trash } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable, {
  type Pagination,
} from "@/components/DataTable/GenericDataTable";
import { getAllUsers, deleteUser } from "@/services/userService";
import type { ActionItem } from "@/components/DataTable/TableActions";
import { useState, useEffect } from "react";
import {
  exportToPDF,
  exportToExcel,
  printUsers,
} from "./_components/ExportUtils";
import type { User } from "@/types/types";

import EditUserDrawer from "./_components/EditUserDrawer";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ViewUserDrawer from "./_components/ViewUserDrawer";
import AddUserDrawer from "./_components/AddUserDrawer";

export function ConfirmAndToastDialog({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
    toast("Action Confirmed", {
      description: "Your settings have been saved successfully.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo clicked"),
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently remove the
            selected data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openAddUserDrawer, setOpenAddUserDrawer] = useState(false);
  const [openEditUserDrawer, setOpenEditUserDrawer] = useState(false);
  const [openViewUserDialog, setOpenViewUserDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Fetch users on component mount and when pagination changes
  useEffect(() => {
    fetchUsers(pagination.currentPage, pagination.limit);
  }, []);

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await getAllUsers(page, limit);

      const users = Array.isArray(response.users) ? response.users : [];

      const sortedUsers = users.sort(
        (a: User, b: User) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const startIndex = (page - 1) * limit;
      const usersWithNumbers = sortedUsers.map((user: User, index: number) => ({
        ...user,
        no: startIndex + index + 1,
      }));

      setUsers(usersWithNumbers);
      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  // Handle page change from the DataTable
  const handlePageChange = (page: number, limit: number) => {
    fetchUsers(page, limit);
  };

  const refetchUsers = () => {
    fetchUsers(pagination.currentPage, pagination.limit);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenEditUserDrawer(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setOpenViewUserDialog(true);
  };

  const handleUserAdded = (newUser: User) => {
    setOpenAddUserDrawer(false);
    refetchUsers(); // Refresh the data when a new user is added
  };

  const handleEditDrawerChange = (open: boolean) => {
    setOpenEditUserDrawer(open);
    if (!open) {
      setTimeout(() => {
        setSelectedUser(null);
      }, 300);
    }
  };

  const handleViewDrawerChange = (open: boolean) => {
    setOpenViewUserDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedUser(null);
      }, 300);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUser(String(user.id));
      refetchUsers(); // Refresh after deletion
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };
  const getUserActions = (user: User): ActionItem[] => {
    return [
      {
        label: "Manage Account",
        href: `/admin/users/${user.id}`,
        icon: <Eye size={16} />,
      },
      {
        label: "Edit User",
        onClick: () => handleEditUser(user),
        icon: <Edit size={16} />,
      },
      {
        label: "Delete User",
        onClick: () => handleDeleteUser(user),
        variant: "destructive",
        icon: <Trash size={16} />,
      },
    ];
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "vehicles",
      headerName: "Vehicles",
      width: 120,
      renderCell: (params) => (
        <span className="text-sm text-center font-medium">
          {params.value?.length ?? 0}
        </span>
      ),
    },
    {
      field: "trackingDevices",
      headerName: "Tracking Devices",
      width: 160,
      renderCell: (params) => (
        <span className="text-sm text-center font-medium">
          {params.value?.length ?? 0}
        </span>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => {
        let bgColor = "bg-gray-100";
        let textColor = "text-gray-700";

        if (params.value === "admin") {
          bgColor = "bg-purple-100";
          textColor = "text-purple-700";
        } else if (params.value === "user") {
          bgColor = "bg-blue-100";
          textColor = "text-blue-700";
        } else if (params.value === "client") {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
        }

        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Joined since",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return <span>-</span>;
        try {
          const date = new Date(params.value);
          return <span>{date.toLocaleString()}</span>;
        } catch (e) {
          console.error("Error formatting date:", e);
          return <span>{params.value}</span>;
        }
      },
    },
  ];

  const handleExportPDF = (selectedUsers: User[]) => {
    try {
      exportToPDF(selectedUsers);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export to PDF. Please try again.");
    }
  };

  const handleExportExcel = (selectedUsers: User[]) => {
    try {
      exportToExcel(selectedUsers);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel. Please try again.");
    }
  };

  const handlePrint = (selectedUsers: User[]) => {
    try {
      printUsers(selectedUsers);
    } catch (error) {
      console.error("Error printing users:", error);
      toast.error("Failed to print. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-1 max-w-[100%]">
      <DataTable
        title="User Management"
        description="Manage all users and their details in one place"
        icon={<Users size={20} />}
        columns={columns}
        data={users}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        addButtonLabel="Add User"
        onAddItem={() => setOpenAddUserDrawer(true)}
        searchPlaceholder="Search users by name, email, role..."
        searchFields={["username", "email", "role", "phoneNumber"]}
        handleExportPDF={handleExportPDF}
        handleExportExcel={handleExportExcel}
        handlePrint={handlePrint}
        getRowActions={getUserActions}
      />

      <AddUserDrawer
        open={openAddUserDrawer}
        onOpenChange={setOpenAddUserDrawer}
        addUserToState={handleUserAdded}
      />

      <ViewUserDrawer
        open={openViewUserDialog}
        onOpenChange={handleViewDrawerChange}
        user={selectedUser}
      />

      <EditUserDrawer
        open={openEditUserDrawer}
        onOpenChange={handleEditDrawerChange}
        user={selectedUser}
        refetchUsers={refetchUsers}
      />
    </div>
  );
}
