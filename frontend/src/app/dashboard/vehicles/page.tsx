"use client"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { GridColDef } from "@mui/x-data-grid"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Filter, RotateCcw, Plus, Eye } from "lucide-react"
import type { PaginationParams } from "@/types"
import apiClient from "@/lib/api/axios"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { VehicleListItemWithUser } from "./VehicleTypes"
import { VehicleStats } from "./_components/vehicle-stats"
import VehicleDrawer from "./_components/vehicle-drawer"




export default function EnhancedVehiclesPage() {
  const router = useRouter()
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 25,
    sortBy: "createdAt",
    sortOrder: "desc",
    filters: {
      status: "all",
      emissionStatus: "all",
    },
  })

  const [vehicles, setVehicles] = useState<VehicleListItemWithUser[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | undefined>()

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get("/vehicles", {
        params: paginationParams,
      })
      setVehicles(res.data.data.data || [])
      setTotalItems(res.data.data.pagination?.totalItems || 0)
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }, [paginationParams])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handlePaginationChange = useCallback((params: PaginationParams) => {
    setPaginationParams((prev) => ({ ...prev, ...params }))
  }, [])

  const resetFilters = () => {
    setPaginationParams((prev) => ({
      ...prev,
      page: 1,
      filters: {
        status: "all",
        emissionStatus: "all",
      },
      includeDeleted: false,
      deletedOnly: false,
    }))
    setFilterSheetOpen(false)
  }

  const applyFilters = () => {
    setFilterSheetOpen(false)
  }

  const handleViewDetails = (vehicleId: number) => {
    router.push(`/dashboard/vehicles/${vehicleId}`)
  }

  const handleEditVehicle = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId)
    setUpdateDrawerOpen(true)
  }

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
    { field: "plateNumber", headerName: "Plate", width: 130 },
    { field: "registrationNumber", headerName: "Reg. No", width: 150 },
    { field: "vehicleType", headerName: "Type", width: 120 },
    { field: "vehicleModel", headerName: "Model", width: 130 },
    { field: "fuelType", headerName: "Fuel", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "NORMAL_EMISSION"
              ? "bg-green-100 text-green-800"
              : params.value === "TOP_POLLUTING"
                ? "bg-red-100 text-red-800"
                : params.value === "UNDER_MAINTENANCE"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      field: "emissionStatus",
      headerName: "Emission",
      width: 150,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "LOW"
              ? "bg-green-100 text-green-800"
              : params.value === "NORMAL"
                ? "bg-blue-100 text-blue-800"
                : params.value === "HIGH"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "user",
      headerName: "Owner",
      width: 180,
      valueGetter: (_, row) => row.user?.username ?? "—",
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      renderCell: (params) => (
        <span className="text-muted-foreground text-sm">{new Date(params.value).toLocaleDateString()}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleViewDetails(params.row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEditVehicle(params.row.id)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      ),
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
    <PopoverContent className="w-80">
      <div className="space-y-6 py-2">
        {/* Status Filter */}
        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={paginationParams.filters?.status || "all"}
            onValueChange={(value) =>
              setPaginationParams((prev) => ({
                ...prev,
                page: 1,
                filters: { ...prev.filters, status: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="NORMAL_EMISSION">Normal Emission</SelectItem>
              <SelectItem value="TOP_POLLUTING">Top Polluting</SelectItem>
              <SelectItem value="INACTIVE_DISCONNECTED">Inactive/Disconnected</SelectItem>
              <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emission Filter */}
        <div className="space-y-1">
          <Label>Emission Status</Label>
          <Select
            value={paginationParams.filters?.emissionStatus || "all"}
            onValueChange={(value) =>
              setPaginationParams((prev) => ({
                ...prev,
                page: 1,
                filters: { ...prev.filters, emissionStatus: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select emission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deleted Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="includeDeleted"
              checked={paginationParams.includeDeleted || false}
              onCheckedChange={(checked) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  includeDeleted: checked as boolean,
                  deletedOnly: checked ? false : prev.deletedOnly,
                }))
              }
            />
            <Label htmlFor="includeDeleted" className="text-sm">Include Deleted</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="deletedOnly"
              checked={paginationParams.deletedOnly || false}
              onCheckedChange={(checked) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  deletedOnly: checked as boolean,
                  includeDeleted: checked ? false : prev.includeDeleted,
                }))
              }
            />
            <Label htmlFor="deletedOnly" className="text-sm">Only Deleted</Label>
          </div>
        </div>

        {/* Apply + Reset Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={applyFilters} className="flex-1">Apply</Button>
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
)

  return (
    <div className="space-y-6">
      {/* Enhanced Statistics */}
      <VehicleStats />

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            title="All Vehicles"
            columns={columns}
            data={vehicles}
            loading={isLoading}
            totalRows={totalItems}
            onPaginationChange={handlePaginationChange}
            filters={paginationParams.filters}
            searchPlaceholder="Search vehicles..."
            customFilters={
              <div className="flex gap-2">
                <FilterPopover />
                <Button onClick={() => setCreateDrawerOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>


      <VehicleDrawer
   
   

        userId={1} 
      />


      <VehicleDrawer
     
        vehicleId={selectedVehicleId}

      />
    </div>
  )
}
