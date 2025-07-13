"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import type { GridColDef } from "@mui/x-data-grid"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { type User, type PaginationParams, UserStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { UpdateAndAddUserSheet } from "./_UsersComponents/UpdateAndAddUser"
import { Input } from "@/components/ui/input"
import { useDynamicCrud } from "@/hooks/use-dynamic-crud"

const STORAGE_KEY = "users-pagination"

export default function UsersPage() {
  // Initialize pagination params without localStorage to avoid hydration issues
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 25,
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const [filters, setFilters] = useState<Record<string, any>>({
    role: undefined,
    status: undefined,
  })

  // Load from localStorage after component mounts
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPaginationParams(parsed)
      } catch (error) {
        console.error("Error parsing saved pagination:", error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Persist pagination state on change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paginationParams))
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [paginationParams])

  const { fetchData } = useDynamicCrud<User>()
  
  // Create stable params with filters included
  const queryParams = useMemo(() => ({
    ...paginationParams,
    filters: Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== "")
    )
  }), [paginationParams, filters])

  const { data, isLoading, refetch } = fetchData("/users", "users", queryParams)

  const handlePaginationChange = useCallback((params: PaginationParams) => {
    setPaginationParams(prev => ({
      ...prev,
      ...params,
      // Ensure we don't reset to page 1 unless explicitly changing limit
      page: params.limit !== prev.limit ? 1 : (params.page || prev.page)
    }))
  }, [])

  const [goToPage, setGoToPage] = useState("")

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
  ]

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const handleGoToPage = useCallback(() => {
    const page = parseInt(goToPage)
    if (!isNaN(page) && page > 0) {
      const maxPage = Math.ceil((data?.pagination?.totalItems || 0) / (paginationParams.limit || 25))
      const validPage = Math.min(page, maxPage)
      
      setPaginationParams(prev => ({ ...prev, page: validPage }))
      setGoToPage("")
    }
  }, [goToPage, data?.pagination?.totalItems, paginationParams.limit])

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4"></div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>

        <UpdateAndAddUserSheet />

        {/* Manual Page Input */}
        <Input
          type="number"
          className="w-24"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          placeholder="Page #"
          min="1"
          max={Math.ceil((data?.pagination?.totalItems || 0) / (paginationParams.limit || 25))}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleGoToPage}
          disabled={!goToPage || isNaN(parseInt(goToPage))}
        >
          Go
        </Button>
      </div>

      <DataTable
        title="All Users"
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        totalRows={data?.pagination?.totalItems || 0}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Search users..."
        filters={filters}
      />
    </div>
  )
}