"use client";
import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  getAllUsers,
  updateUser,
  deleteUser
} from "@/api/services/userService";
import { User } from "@/types/types";
import Box from "@mui/material/Box";
import AddVehicleDrawer from "./AddVehicleDrawer";
import { DeleteUserDialog } from "./deleteUserDialog";
import AddUserDrawer from "./AddUserDrawer";
import EditUserDrawer from "./EditUserDrawer";
import {
  Download,
  FileType,
  Printer,
  Plus,
  Users,
  Filter,
  Trash2,
  UserCog,
  ChevronDown,
  Search
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";

// Custom toolbar component with export options
function CustomToolbar({
  selectedRows,
  data,
  handleExportPDF,
  handleExportExcel
}: {
  selectedRows: GridRowSelectionModel;
  data: User[];
  handleExportPDF: () => void;
  handleExportExcel: () => void;
}) {
  return (
    <GridToolbarContainer className="flex justify-between p-3 border-b bg-gray-50 rounded-t-md">
      <div className="flex gap-2">
        <div className="text-gray-700 flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarColumnsButton />
        </div>
        <div className="text-gray-700 flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarFilterButton />
        </div>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={selectedRows.length === 0}
          className="flex items-center gap-1 bg-white hover:bg-gray-100">
          <Download size={16} />
          PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          disabled={selectedRows.length === 0}
          className="flex items-center gap-1 bg-white hover:bg-gray-100">
          <FileType size={16} />
          Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="flex items-center gap-1 bg-white hover:bg-gray-100">
          <Printer size={16} />
          Print
        </Button>
      </div>
    </GridToolbarContainer>
  );
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddVehicleDrawer, setOpenAddVehicleDrawer] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openAddUserDrawer, setOpenAddUserDrawer] = useState(false);
  const [openEditUserDrawer, setOpenEditUserDrawer] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10 // Default limit
  });

  const handleOpenAddVehicleDrawer = (userId: string) => {
    setSelectedUserId(userId);
    setOpenAddVehicleDrawer(true);
  };

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
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

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenEditUserDrawer(true);
  };

  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]); // Insert new user at the top
    setFilteredUsers((prevUsers) => [newUser, ...prevUsers]);
    setPagination((prev) => ({
      ...prev,
      totalItems: prev.totalItems + 1 // Increase total count
    }));
    setOpenAddUserDrawer(false);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      console.log("Deleting user with ID:", userId);
      await deleteUser(userId.toString());
      setUsers(users.filter((user) => user.id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  // const handlePaginationLimitChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const newLimit = parseInt(event.target.value, 10);
  //   setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
  // };

  const handlePaginationLimitChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    if (value === "custom") {
      // Handle custom limit case separately
      const customLimit = prompt("Enter custom limit:");
      if (customLimit) {
        const parsedLimit = parseInt(customLimit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          setPagination((prev) => ({ ...prev, limit: parsedLimit, currentPage: 1 }));
        }
      }
    } else if (value === "all") {
      // Fetch all records by setting a very high limit
      // You might want to add a confirmation dialog for large datasets
      const fetchAllRecords = async () => {
        try {
          setLoading(true);
          // Use a large number to effectively get all records
          // You may need to adjust your API to handle this special case
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

      const totalItems = pagination.totalItems;
      if (totalItems > 1000) {
        // For very large datasets, show a confirmation
        if (
          confirm(
            `This will load all ${totalItems} records. This may affect performance. Continue?`
          )
        ) {
          fetchAllRecords();
        } else {
          // Reset to previous value if user cancels
          event.target.value = pagination.limit.toString();
        }
      } else {
        fetchAllRecords();
      }
    } else {
      // Handle normal numeric options
      const newLimit = parseInt(value, 10);
      setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
      // Refetch with new limit
      fetchUsers(1, newLimit);
    }
  };
  // Function to handle PDF export
  const handleExportPDF = () => {
    if (selectionModel.length === 0) return;

    const doc = new jsPDF();
    const selectedUsers = users.filter((user) =>
      selectionModel.includes(user.id)
    );

    // Define columns for the PDF table
    const tableColumn = [
      "ID",
      "Name",
      "Email",
      "Role",
      "Phone",
      "Cars",
      "Devices"
    ];
    const tableRows = selectedUsers.map((user) => [
      user.id ?? "",
      user.username ?? "",
      user.email ?? "",
      user.role ?? "",
      user.phoneNumber ?? "",
      user.vehicles.length ?? 0,
      user.trackingDevices.length ?? 0
    ]);

    // Add title
    doc.text("User Data Export", 14, 15);

    // Add export date
    const date = new Date().toLocaleDateString();
    doc.text(`Export Date: ${date}`, 14, 23);

    // Add the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30
    });

    // Save the PDF
    doc.save(`users-export-${date}.pdf`);
  };

  // Function to handle Excel export
  const handleExportExcel = () => {
    if (selectionModel.length === 0) return;

    const selectedUsers = users.filter((user) =>
      selectionModel.includes(user.id)
    );

    // Prepare the data for Excel
    const workSheetData = selectedUsers.map((user) => ({
      ID: user.id,
      Name: user.username,
      Email: user.email,
      Role: user.role,
      Phone: user.phoneNumber,
      "Number of Cars": user.vehicles.length,
      "Number of Devices": user.trackingDevices.length
    }));

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(workSheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate Excel file
    const date = new Date().toLocaleDateString().replace(/\//g, "-");
    XLSX.writeFile(workbook, `users-export-${date}.xlsx`);
  };

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
      )
    },
    {
      field: "username",
      headerName: "Name",
      width: 180,
      renderCell: (params) => <div className="font-medium">{params.value}</div>
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <div className="text-gray-600">{params.value}</div>
      )
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
            className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
            {params.value}
          </div>
        );
      }
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <div className="text-gray-600">{params.value}</div>
      )
    },
    {
      field: "vehicles",
      headerName: "Cars",
      width: 80,
      renderCell: (params) => (
        <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
          {params.value.length}
        </div>
      )
    },
    {
      field: "trackingDevices",
      headerName: "Devices",
      width: 80,
      renderCell: (params) => (
        <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
          {params.value.length}
        </div>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <DropdownMenu
          open={openDropdownId === params.row.id}
          onOpenChange={(open) => {
            setOpenDropdownId(open ? params.row.id : null);
          }}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2 bg-white">
              Actions <ChevronDown size={14} className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onClick={() => handleEditUser(params.row)}
              className="flex items-center gap-2 cursor-pointer">
              <UserCog size={14} />
              Edit User
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                handleOpenAddVehicleDrawer(params.row.id.toString())
              }
              className="flex items-center gap-2 cursor-pointer">
              <Plus size={14} />
              Add Vehicle
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setOpenDropdownId(null);
              }}
              asChild>
              <DeleteUserDialog
                userId={params.row.id.toString()}
                refetchUsers={() =>
                  fetchUsers(pagination.currentPage, pagination.limit)
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const addUserToState = (newUser: User) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]); // Add new user at the top of the list
    setFilteredUsers((prevUsers) => [newUser, ...prevUsers]);
    setPagination((prev) => ({
      ...prev,
      totalItems: prev.totalItems + 1 // Increase total count
    }));
  };

  // Bulk actions for selected users
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
          // setUsers(users.filter(user => !selectionModel.includes(user.id)));
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
    <div className="container mx-auto px-4 py-6">
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
            <div className="flex-1 w-full md:w-auto max-w-md relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search users by name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {selectionModel.length > 0 && (
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
              )}
           
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">
                  Items per page:
                </label>
                <select
                  value={pagination.limit}
                  onChange={handlePaginationLimitChange}
                  className="p-2 border rounded h-9 bg-white text-sm">
                  {[10, 25, 50, 100, 250, 500].map((limit) => (
                    <option key={limit} value={limit}>
                      {limit}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                  <option value="all">All</option>
                </select>

                {pagination.limit.toString() === "custom" && (
                  <div className="ml-2 flex items-center">
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter limit"
                      className="p-2 border rounded w-24 h-9 bg-white text-sm"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          setPagination((prev) => ({
                            ...prev,
                            limit: value,
                            currentPage: 1
                          }));
                        }
                      }}
                    />
                  </div>
                )}
              </div>
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
                  <CustomToolbar
                    selectedRows={selectionModel}
                    data={users}
                    handleExportPDF={handleExportPDF}
                    handleExportExcel={handleExportExcel}
                    {...props}
                  />
                )
              }}
              slotProps={{}}
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
        addUserToState={addUserToState}
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
