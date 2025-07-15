"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import type { GridColDef } from "@mui/x-data-grid"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { type User, type PaginationParams, UserStatus, GetUserByIdResponse } from "@/types"
import { Button } from "@/components/ui/button"


import apiClient from "@/lib/api/axios"
import { UpdateAndAddUserSheet } from "./_UserComponents/UpdateAndAddUser"
import { DeleteUserDialog } from "./_UserComponents/DeleteUserDialog"

const STORAGE_KEY = "users-pagination"

export default function UsersPage() {
const [paginationParams, setPaginationParams] = useState<PaginationParams>({
  page: 1,
  limit: 25,
  sortBy: "createdAt",
  sortOrder: "desc",
  filters: {
    role: "",
    status: "",
  },
})


  const [data, setData] = useState<User[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [goToPage, setGoToPage] = useState("")
const [selectedUser, setSelectedUser] = useState<GetUserByIdResponse | null>(null);
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const fetchUsers = useCallback(async () => {
  setIsLoading(true)
  try {
    const response = await apiClient.get("/users", {
      params: paginationParams,
    })
    setData(response.data.data.data || [])
    setTotalItems(response.data.data.pagination?.totalItems || 0)
  } catch (error) {
    console.error("Failed to fetch users:", error)
  } finally {
    setIsLoading(false)
  }
}, [paginationParams])


  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePaginationChange = useCallback((params: PaginationParams) => {
    setPaginationParams((prev) => {
      const merged = { ...prev, ...params }
      return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged
    })
  }, [])

  const handleGoToPage = useCallback(() => {
    const page = parseInt(goToPage)
    if (!isNaN(page) && page > 0) {
      const maxPage = Math.ceil(totalItems / (paginationParams.limit || 25))
      const validPage = Math.min(page, maxPage)
      setPaginationParams((prev) => ({ ...prev, page: validPage }))
      setGoToPage("")
    }
  }, [goToPage, totalItems, paginationParams.limit])

  const handleRefresh = useCallback(() => {
    setPaginationParams((prev) => ({ ...prev })) // triggers refetch
  }, [])

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "ID",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const page = paginationParams.page || 1
        const limit = paginationParams.limit || 25
        const rowIndex = params.api.getSortedRowIds().indexOf(params.id)
        const serialNumber = (page - 1) * limit + rowIndex + 1
        return <span>{serialNumber}</span>
      },
    },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { field: "companyName", headerName: "Company", width: 180 },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => <Badge variant="secondary">{params.value}</Badge>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const variant =
          params.value === UserStatus.ACTIVE
            ? "default"
            : params.value === UserStatus.PENDING_APPROVAL
            ? "secondary"
            : "destructive"
        return <Badge variant={variant}>{params.value}</Badge>
      },
    },
    {
      field: "vehiclesCount",
      headerName: "Vehicles",
      width: 100,
      valueGetter: (_, row) => row._count?.vehicles ?? 0,
    },
    {
      field: "devicesCount",
      headerName: "Devices",
      width: 100,
      valueGetter: (_, row) => row._count?.trackingDevices ?? 0,
    },
    {
      field: "alertsCount",
      headerName: "Alerts",
      width: 100,
      valueGetter: (_, row) => row._count?.alerts ?? 0,
    },
    {
      field: "reportsCount",
      headerName: "Reports",
      width: 100,
      valueGetter: (_, row) => row._count?.reports ?? 0,
    },
    {
      field: "notificationsCount",
      headerName: "Notifications",
      width: 130,
      valueGetter: (_, row) => row._count?.userNotifications ?? 0,
    },
    {
      field: "createdAt",
      headerName: "Joined Since",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    
    {
  field: "actions",
  headerName: "Actions",
  width: 160,
  sortable: false,
  filterable: false,
  renderCell: (params) => {
    const user = params.row as GetUserByIdResponse;
    return (
      <div className="flex gap-2">
        <Button

          variant="outline"
          onClick={() => {
            setSelectedUser(user);
            setEditDialogOpen(true);
          }}
        >
          Edit
        </Button>
        <Button
     
          variant="destructive"
          onClick={() => {
            setSelectedUser(user);
            setDeleteDialogOpen(true);
          }}
        >
          Delete
        </Button>
      </div>
    );
  },
}

  ]

const userFilters = (
  <div className="flex flex-wrap items-center gap-6">
    {/* Role Filter */}
    <div>
      <label className="text-sm font-medium">Role</label>
      <select
        className="ml-2 border rounded px-2 py-1"
        value={paginationParams.filters?.role || ""}
        onChange={(e) =>
          setPaginationParams((prev) => ({
            ...prev,
            page: 1,
            filters: {
              ...prev.filters,
              role: e.target.value,
            },
          }))
        }
      >
        <option value="">All</option>
        <option value="ADMIN">Admin</option>
        <option value="USER">User</option>
        <option value="TECHNICIAN">Technician</option>
        <option value="MANAGER">Manager</option>
        <option value="FLEET_MANAGER">Fleet Manager</option>
        <option value="ANALYST">Analyst</option>
        <option value="SUPPORT_AGENT">Support Agent</option>
      </select>
    </div>

    {/* Status Filter */}
    <div>
      <label className="text-sm font-medium">Status</label>
      <select
        className="ml-2 border rounded px-2 py-1"
        value={paginationParams.filters?.status || ""}
        onChange={(e) =>
          setPaginationParams((prev) => ({
            ...prev,
            page: 1,
            filters: {
              ...prev.filters,
              status: e.target.value,
            },
          }))
        }
      >
        <option value="">All</option>
        <option value={UserStatus.ACTIVE}>Active</option>
        <option value={UserStatus.PENDING_APPROVAL}>Pending Approval</option>
        <option value={UserStatus.SUSPENDED}>Suspended</option>
        <option value={UserStatus.DEACTIVATED}>Deactivated</option>
      </select>
    </div>

    {/* Include Deleted Toggle */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="includeDeleted"
        checked={paginationParams.includeDeleted || false}
        onChange={(e) =>
          setPaginationParams((prev) => ({
            ...prev,
            page: 1,
            includeDeleted: e.target.checked,
            deletedOnly: e.target.checked ? false : prev.deletedOnly,
          }))
        }
      />
      <label htmlFor="includeDeleted" className="text-sm font-medium">
        Include Deleted
      </label>
    </div>

    {/* Deleted Only Toggle */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="deletedOnly"
        checked={paginationParams.deletedOnly || false}
        onChange={(e) =>
          setPaginationParams((prev) => ({
            ...prev,
            page: 1,
            deletedOnly: e.target.checked,
            includeDeleted: e.target.checked ? false : prev.includeDeleted,
          }))
        }
      />
      <label htmlFor="deletedOnly" className="text-sm font-medium">
        Deleted Only
      </label>
    </div>

    {/* Reset Filters Button */}
    <div className="flex items-center">
      <button
        type="button"
        onClick={() =>
          setPaginationParams((prev) => ({
            ...prev,
            page: 1,
            filters: {
              role: "",
              status: "",
            },
            includeDeleted: false,
            deletedOnly: false,
          }))
        }
        className="ml-4 rounded bg-gray-200 px-3 py-1 text-sm font-medium hover:bg-gray-300"
      >
        Reset All Filters
      </button>
    </div>
  </div>
)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>





      <DataTable
        title="All Users"
 additionHeaderContent={<UpdateAndAddUserSheet />}
        columns={columns}
        data={data}
        loading={isLoading}
        totalRows={totalItems}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Search users..."
        filters={paginationParams.filters}
  customFilters={userFilters}
      />
      
      
      
      {selectedUser && (
  <UpdateAndAddUserSheet
    key={selectedUser.id + (editDialogOpen ? "edit" : "")}
    initialData={selectedUser}
    isEditing
    onUserCreated={fetchUsers}
  />
)}

{selectedUser && (
  <DeleteUserDialog
    user={selectedUser}
    open={deleteDialogOpen}
    onOpenChange={setDeleteDialogOpen}
    onDeleted={fetchUsers}
  />
)}

    </div>
  )
}
