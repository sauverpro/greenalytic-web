
"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import type { User } from "@/types/types";
import { exportToExcel, exportToPDF } from "./ExportUtils";
import UserActions from "./UserActions";
import BulkActions from "./BulkActions";
import AddUserDrawer from "./AddUserDrawer";
import EditUserDrawer from "./EditUserDrawer";
import AddVehicleDrawer from "./AddVehicleDrawer";
import ViewUserDrawer from "./ViewUserDrawer";
import { getAllUsers } from "@/services/userService";
import DataTable from "@/components/DataTable/GenericDataTable";

function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openAddUserDrawer, setOpenAddUserDrawer] = useState(false);
  const [openEditUserDrawer, setOpenEditUserDrawer] = useState(false);
  const [openAddVehicleDrawer, setOpenAddVehicleDrawer] = useState(false);
  const [openViewUserDialog, setOpenViewUserDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPagination, setCurrentPagination] = useState({
    currentPage: 1,
    limit: 10,
  });

  // Edit user handler
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenEditUserDrawer(true);
  };

  // Handler for adding vehicles
  const handleOpenAddVehicleDrawer = (userId: string) => {
    setSelectedUserId(userId);
    setOpenAddVehicleDrawer(true);
  };

  // Handle opening the "View User" dialog
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setOpenViewUserDialog(true);
  };

  // Fetch users with pagination
  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setCurrentPagination({ currentPage: page, limit });
      const response = await getAllUsers(page, limit);
      const sortedUsers = response.users.sort(
        (a: User, b: User) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        data: sortedUsers,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          limit: limit,
        },
      };
    }
  };

  // User created callback
  const handleUserAdded = (newUser: User) => {
    // Refresh the data after adding a user
    fetchUsers(currentPagination.currentPage, currentPagination.limit);
    setOpenAddUserDrawer(false);
  };

  // Define columns for users
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "image",
      headerName: "Profile",
      width: 80,
      renderCell: (params) => (
        <div className="flex justify-center w-full">
          <img
            src={params.value || "/placeholder-avatar.png"}
            alt="User"
            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Name",
      width: 180,
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <div className="text-gray-600">{params.value}</div>
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
          bgColor = "bg-blue-100";
          textColor = "text-blue-700";
        } else if (params.value === "manager") {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
        } else if (params.value === "user") {
          bgColor = "bg-purple-100";
          textColor = "text-purple-700";
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
      field: "phoneNumber",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <div className="text-gray-600">{params.value}</div>
      ),
    },
    {
      field: "vehicles",
      headerName: "Cars",
      width: 80,
      renderCell: (params) => (
        <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
          {params.value?.length || 0}
        </div>
      ),
    },
    {
      field: "trackingDevices",
      headerName: "Devices",
      width: 80,
      renderCell: (params) => (
        <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
          {params.value?.length || 0}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <UserActions
          user={params.row}
          onEditUser={handleEditUser}
          onAddVehicle={handleOpenAddVehicleDrawer}
          onViewUser={handleViewUser}
          refetchUsers={() =>
            fetchUsers(currentPagination.currentPage, currentPagination.limit)
          }
        />
      ),
    },
  ];

  // Create a bulk actions component with the current selection
  const renderBulkActions = (selectionModel: any[]) => {
    return (
      <BulkActions
        selectionModel={selectionModel}
        fetchUsers={() =>
          fetchUsers(currentPagination.currentPage, currentPagination.limit)
        }
        pagination={{
          currentPage: currentPagination.currentPage,
          totalPages: 1,
          totalItems: 0,
          limit: currentPagination.limit,
        }}
      />
    );
  };

  return (
    <div className="h-full flex flex-1 max-w-[100%]">
      <DataTable<User>
        title="User Management"
        description="Manage all users and their details in one place"
        icon={<Users size={20} />}
        columns={columns}
        fetchData={fetchUsers}
        addButtonLabel="Add User"
        onAddItem={() => setOpenAddUserDrawer(true)}
        searchPlaceholder="Search users by name, email, role..."
        searchFields={["username", "email", "role", "phoneNumber"]}
        handleExportPDF={exportToPDF}
        handleExportExcel={exportToExcel}
        bulkActionsComponent={renderBulkActions([])}
      />

      {/* Add User Drawer */}
      {openAddUserDrawer && (
        <AddUserDrawer
          open={openAddUserDrawer}
          onOpenChange={(open) => setOpenAddUserDrawer(open)}
          addUserToState={handleUserAdded}
        />
      )}

      {/* Edit User Drawer */}
      {openEditUserDrawer && selectedUser && (
        <EditUserDrawer
          open={openEditUserDrawer}
          onOpenChange={(open) => setOpenEditUserDrawer(open)}
          user={selectedUser}
          refetchUsers={() =>
            fetchUsers(currentPagination.currentPage, currentPagination.limit)
          }
        />
      )}

      {/* Add Vehicle Drawer */}
      {openAddVehicleDrawer && selectedUserId && (
        <AddVehicleDrawer
          open={openAddVehicleDrawer}
          onOpenChange={(open) => setOpenAddVehicleDrawer(open)}
          userId={selectedUserId}
          onVehicleAdded={() =>
            fetchUsers(currentPagination.currentPage, currentPagination.limit)
          }
        />
      )}

      {/* View User Drawer */}
      {openViewUserDialog && selectedUser && (
        <ViewUserDrawer
          open={openViewUserDialog}
          onOpenChange={(open) => setOpenViewUserDialog(open)}
          user={selectedUser}
        />
      )}
    </div>
  );
}

export default UsersPage;

