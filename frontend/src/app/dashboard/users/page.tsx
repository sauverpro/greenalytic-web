"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { GridColDef } from "@mui/x-data-grid"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Eye,  Trash2, Users, UserCheck, UserX, Clock } from "lucide-react"
import { type User, type PaginationParams, type GetUserByIdResponse } from "@/types"
import apiClient from "@/lib/api/axios"
import { UpdateAndAddUserSheet } from "./_UserComponents/UpdateAndAddUser"
import { DeleteUserDialog } from "./_UserComponents/DeleteUserDialog"
import { UserStatus } from "@/types/EnumTypes"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import VehicleDrawer from "../vehicles/_components/vehicle-drawer"



export default function UsersPage() {
  const router = useRouter()
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 25,
    sortBy: "createdAt",
    sortOrder: "desc",
    filters: {
      role: "all",
      status: "all",
    },
  })

  const [data, setData] = useState<User[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<GetUserByIdResponse | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)


  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    
    console.log("params of users  are  the ",paginationParams)
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


  const handleViewDetails = (userId: number) => {
    router.push(`/dashboard/users/${userId}`)
  }

  const resetFilters = () => {
    setPaginationParams((prev) => ({
      ...prev,
      page: 1,
      filters: {
        role: "all",
        status: "all",
      },
      includeDeleted: false,
      deletedOnly: false,
    }))

  }



  // Get stats for the header cards
  const getStatusStats = () => {
    const stats = {
      total: totalItems,
      active: 0,
      pending: 0,
      suspended: 0,
    }

    data.forEach((user) => {
      switch (user.status) {
        case UserStatus.ACTIVE:
          stats.active++
          break
        case UserStatus.PENDING_APPROVAL:
          stats.pending++
          break
        case UserStatus.SUSPENDED:
          stats.suspended++
          break
      }
    })

    return stats
  }

  const stats = getStatusStats()

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
        return <span className="font-medium text-muted-foreground">{serialNumber}</span>
      },
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
      renderCell: (params) => <div className="text-muted-foreground">{params.value}</div>,
    },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { field: "companyName", headerName: "Company", width: 180 },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => (
        <Badge variant="outline" className="font-medium">
          {params.value}
        </Badge>
      ),
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
      renderCell: (params) => <div className="text-center font-medium">{params.value}</div>,
    },
    {
      field: "devicesCount",
      headerName: "Devices",
      width: 100,
      valueGetter: (_, row) => row._count?.trackingDevices ?? 0,
      renderCell: (params) => <div className="text-center font-medium">{params.value}</div>,
    },
    {
      field: "alertsCount",
      headerName: "Alerts",
      width: 100,
      valueGetter: (_, row) => row._count?.alerts ?? 0,
      renderCell: (params) => <div className="text-center font-medium">{params.value}</div>,
    },
    {
      field: "createdAt",
      headerName: "Joined",
      width: 120,
      renderCell: (params) => (
        <div className="text-muted-foreground text-sm">{new Date(params.value).toLocaleDateString()}</div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as GetUserByIdResponse
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user.id)} className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
asChild
            >

               <UpdateAndAddUserSheet  userId={user.id} isEditing={true} />
            
            </Button>
            <Button asChild>
              
               <VehicleDrawer userId={user.id}/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedUser(user)
                setDeleteDialogOpen(true)
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
const FilterPopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Filter className="h-4 w-4" />
        Filters
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-72" side="bottom" align="start">
      <div className="space-y-4">
        {/* Role Filter */}
        <div className="space-y-1">
          <Label className="text-sm">Role</Label>
          <Select
            value={paginationParams.filters?.role as string|| "all"}
            onValueChange={(value) =>
              setPaginationParams((prev) => ({
                ...prev,
                page: 1,
                filters: {
                  ...prev.filters,
                  role: value,
                },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="TECHNICIAN">Technician</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="FLEET_MANAGER">Fleet Manager</SelectItem>
                <SelectItem value="ANALYST">Analyst</SelectItem>
                <SelectItem value="SUPPORT_AGENT">Support Agent</SelectItem>
    
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <Label className="text-sm">Status</Label>
          <Select
            value={paginationParams.filters?.status as string || "all"}
            onValueChange={(value) =>
              setPaginationParams((prev) => ({
                ...prev,
                page: 1,
                filters: {
                  ...prev.filters,
                  status: value,
                },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={UserStatus.PENDING_APPROVAL}>Pending</SelectItem>
              <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
              <SelectItem value={UserStatus.DEACTIVATED}>Deactivated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deleted toggles */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDeleted"
              checked={paginationParams.includeDeleted || false}
              onCheckedChange={(checked) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  page: 1,
                  includeDeleted: checked as boolean,
                  deletedOnly: checked ? false : prev.deletedOnly,
                }))
              }
            />
            <Label htmlFor="includeDeleted" className="text-sm">Include Deleted</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="deletedOnly"
              checked={paginationParams.deletedOnly || false}
              onCheckedChange={(checked) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  page: 1,
                  deletedOnly: checked as boolean,
                  includeDeleted: checked ? false : prev.includeDeleted,
                }))
              }
            />
            <Label htmlFor="deletedOnly" className="text-sm">Only Deleted</Label>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
     
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
)


  return (
    <div className="space-y-6">



      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardContent className="p-0">
          <DataTable
            title="All Users"
            columns={columns}
            data={data}
            loading={isLoading}
            totalRows={totalItems}
            onPaginationChange={handlePaginationChange}
            searchPlaceholder="Search users..."
            filters={paginationParams.filters}
            customFilters={      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
   
             <FilterPopover />
          <UpdateAndAddUserSheet onUserCreated={fetchUsers} />
        </div>
      </div>
              
            }
          />
        </CardContent>
      </Card>



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
