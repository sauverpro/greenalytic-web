"use client";
// 1. Main UserTable component (UserTable.tsx)
import { useState, useEffect } from "react";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Search, Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAllUsers } from "@/api/services/userService";
import { User } from "@/types/types";



import AddUserDrawer from "./AddUserDrawer";
import EditUserDrawer from "./EditUserDrawer";
import AddVehicleDrawer from "./AddVehicleDrawer";
import { exportToExcel, exportToPDF } from "./ExportUtils";
import { getDataGridColumns } from "./UserTableColumns";
import SearchAndFilter from "./SearchAndFilter";
import BulkActions from "./BulkActions";
import PaginationControls from "./PaginationControls";
import TableToolbar from "./TableToolbar";
import ViewUserDrawer from "./ViewUserDrawer";


const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openAddUserDrawer, setOpenAddUserDrawer] = useState(false);
  const [openEditUserDrawer, setOpenEditUserDrawer] = useState(false);
  const [openAddVehicleDrawer, setOpenAddVehicleDrawer] = useState(false);
  const [openViewUserDialog, setOpenViewUserDialog] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Fetch users with pagination
  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await getAllUsers(page, limit);
      const sortedUsers = response.users.sort(
        (a: User, b: User) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchUsers(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit]);

  // Apply search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

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
    setSelectedUser(user); // Set the selected user
    setOpenViewUserDialog(true); // Open the view user dialog
  };

  // User created callback
  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
    setFilteredUsers((prevUsers) => [newUser, ...prevUsers]);
    setPagination((prev) => ({
      ...prev,
      totalItems: prev.totalItems + 1
    }));
    setOpenAddUserDrawer(false);
  };

  // Function to handle PDF export
  const handleExportPDF = () => {
    if (selectionModel.length === 0) return;
    const selectedUsers = users.filter((user) =>
      selectionModel.includes(user.id)
    );
    exportToPDF(selectedUsers);
  };

  // Function to handle Excel export
  const handleExportExcel = () => {
    if (selectionModel.length === 0) return;
    const selectedUsers = users.filter((user) =>
      selectionModel.includes(user.id)
    );
    exportToExcel(selectedUsers);
  };

  // Custom pagination limit handling
  const handlePaginationLimitChange = (newLimit: number | string) => {
    if (typeof newLimit === "number") {
      setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
      fetchUsers(1, newLimit);
    } else if (newLimit === "all") {
      fetchAllRecords();
    }
  };

  // Function to fetch all records
  const fetchAllRecords = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(1, 999999);
      const sortedUsers = response.users.sort(
        (a: User, b: User) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
      setPagination((prev) => ({
        ...prev,
        limit: response.users.length,
        currentPage: 1,
        totalItems: response.users.length
      }));
    } catch (error) {
      console.error("Failed to fetch all records", error);
    } finally {
      setLoading(false);
    }
  };

  // Get columns with action handlers
  const columns = getDataGridColumns(
    
    handleEditUser,
    handleOpenAddVehicleDrawer,
    handleViewUser,
    fetchUsers,
    pagination
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[100%]">
      <Card className="w-full bg-white shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Users size={20} /> User Management
              </CardTitle>
              <CardDescription className="text-gray-500">
                Manage all users and their details in one place
              </CardDescription>
            </div>
            <Button
              onClick={() => setOpenAddUserDrawer(true)}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-1" /> Add User
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search and filter component */}
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="flex flex-wrap items-center gap-3">
              {/* Bulk actions component */}
              {selectionModel.length > 0 && (
                <BulkActions
                  selectionModel={selectionModel}
                  fetchUsers={fetchUsers}
                  pagination={pagination}
                />
              )}

              {/* Pagination controls component */}
              <PaginationControls
                limit={pagination.limit}
                onLimitChange={handlePaginationLimitChange}
              />
            </div>
          </div>

          <Box
            sx={{
              height: "auto",
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSizeOptions={[pagination.limit]}
              paginationMode="server"
              rowCount={pagination.totalItems}
              autoHeight={true}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={selectionModel}
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
              slots={{
                toolbar: (props) => (
                  <TableToolbar
                    selectedRows={selectionModel}
                    data={users}
                    handleExportPDF={handleExportPDF}
                    handleExportExcel={handleExportExcel}
                    {...props}
                  />
                )
              }}
              className="border rounded-md shadow-sm"
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f9fafb",
                  fontSize: "0.875rem",
                  fontWeight: "600"
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f3f4f6"
                },
                "& .MuiDataGrid-cell": {
                  padding: "12px 16px"
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#f9fafb",
                  borderTop: "1px solid #e5e7eb"
                },
                "& .MuiTablePagination-root": {
                  color: "#4b5563"
                },
                "& .MuiCheckbox-root": {
                  color: "#6b7280"
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none"
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Separate component drawers */}
      <AddVehicleDrawer
        open={openAddVehicleDrawer}
        onOpenChange={setOpenAddVehicleDrawer}
        userId={selectedUserId ?? ""}
        refetchVehicles={() =>
          fetchUsers(pagination.currentPage, pagination.limit)
        }
      />

      <AddUserDrawer
        open={openAddUserDrawer}
        onOpenChange={setOpenAddUserDrawer}
        addUserToState={handleUserAdded}
      />
      {/* View User Drawer */}
      <ViewUserDrawer
        open={openViewUserDialog}
        // onOpenChange={setOpenViewUserDialog}
        onOpenChange={setOpenViewUserDialog}
        user={selectedUser}
      />
      <EditUserDrawer
        open={openEditUserDrawer}
        onOpenChange={setOpenEditUserDrawer}
        user={selectedUser}
        refetchUsers={() =>
          fetchUsers(pagination.currentPage, pagination.limit)
        }
      />
    </div>
  );
};

export default UserTable;
