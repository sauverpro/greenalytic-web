"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { getAllUsers, updateUser, deleteUser } from "@/services/userService";
import { User } from "@/types/types";
import Box from "@mui/material/Box";
import AddVehicleDrawer from "./AddVehicleDrawer";
import { DeleteUserDialog } from "./deleteUserDialog";




const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10 // Default limit
  });

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      const response = await getAllUsers(page, limit);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit]);

  const handleEditUser = (user: User) => {
    console.log("Edit user:", user);
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update user on the server
      const updatedUser = await updateUser(
        selectedUser.id.toString(),
        selectedUser
      );

      // Directly update the user in the local state
      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedUser.user } : user
        );
      });

      setOpenEditDialog(false); // Close the dialog after update
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      console.log("Deleting user with ID:", userId);
      await deleteUser(userId.toString());
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handlePaginationLimitChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "image",
      headerName: "Profile",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="User"
          className="h-10 w-10 rounded-full object-cover"
        />
      )
    },
    { field: "username", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "role", headerName: "Role" },
    { field: "phoneNumber", headerName: "Phone" },
    {
      field: "vehicles",
      headerName: "Cars",
      renderCell: (params) => params.value.length
    },
    {
      field: "trackingDevices",
      headerName: "Devices",
      renderCell: (params) => params.value.length
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <DropdownMenu
          open={openDropdownId === params.row.id}
          onOpenChange={(open) => {
            setOpenDropdownId(open ? params.row.id : null);
          }}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEditUser(params.row)}>
              Edit
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleDeleteUser(params.row.id)}>
              Delete
            </DropdownMenuItem> */}

            <DropdownMenuItem onSelect={() => setOpenDropdownId(null)} asChild>
              <DeleteUserDialog
                userId={params.row.id.toString()}
                refetchUsers={() =>
                  fetchUsers(pagination.currentPage, pagination.limit)
                }
              />
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => setOpenDropdownId(null)} asChild>
              <AddVehicleDrawer
                userId={params.row.id.toString()}
                refetchVehicles={() =>
                  fetchUsers(pagination.currentPage, pagination.limit)
                }
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                console.log("Additional action triggered");
                setOpenDropdownId(null);
              }}
              asChild>
              Additional Action
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center w-[94%]">
        <Button
          onClick={() =>
            setSelectedUser({
              id: 0,
              username: "",
              email: "",
              phoneNumber: "",
              role: "USER",
              image: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              vehicles: [],
              trackingDevices: []
            })
          }
          variant="default">
          Add User
        </Button>

        <div>
          <label className="mr-2">Items per page:</label>
          <select
            value={pagination.limit}
            onChange={handlePaginationLimitChange}
            className="p-2 border rounded">
            {[10, 25, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Box sx={{ height: 520, width: "94%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSizeOptions={[pagination.limit]}
          paginationMode="server"
          rowCount={pagination.totalItems}
          autoHeight={true}
          checkboxSelection
          disableRowSelectionOnClick
          paginationModel={{
            page: pagination.currentPage - 1,
            pageSize: pagination.limit
          }}
          onPaginationModelChange={(newPaginationModel) =>
            setPagination((prev) => ({
              ...prev,
              currentPage: newPaginationModel.page + 1
            }))
          }
        />
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogTrigger />
        <DialogContent>
          <h2 className="text-lg font-bold mb-4">Edit User</h2>
          {selectedUser && (
            <div>
              <label>Username</label>
              <input
                type="text"
                value={selectedUser.username}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, username: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <label>Email</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <label>Phone</label>
              <input
                type="text"
                value={selectedUser.phoneNumber}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    phoneNumber: e.target.value
                  })
                }
                className="w-full p-2 border rounded"
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={handleUpdateUser} variant="default">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;
