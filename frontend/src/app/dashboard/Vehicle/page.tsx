"use client"

import { useState, useCallback, useEffect } from "react"
import type { GridColDef } from "@mui/x-data-grid"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Filter, RotateCcw, CarFront, Factory } from "lucide-react"
import { VehicleStatus, EmissionStatus } from "@/types/EnumTypes"
import { type PaginationParams } from "@/types"
import apiClient from "@/lib/api/axios"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleListItemWithUser } from "./VehicleTypes"

export default function VehiclesPage() {
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

  const columns: GridColDef[] = [
    { field: "plateNumber", headerName: "Plate", width: 130 },
    { field: "registrationNumber", headerName: "Reg. No", width: 150 },
    { field: "vehicleType", headerName: "Type", width: 120 },
    { field: "vehicleModel", headerName: "Model", width: 130 },
    { field: "fuelType", headerName: "Fuel", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
    {
      field: "emissionStatus",
      headerName: "Emission",
      width: 150,
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
        <span className="text-muted-foreground text-sm">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const FilterSheet = () => (
    <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] max-h-[500px]">
        <SheetHeader>
          <SheetTitle>Filter Vehicles</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={paginationParams.filters?.status || "all"}
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emission Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Emission Status</Label>
            <Select
              value={paginationParams.filters?.emissionStatus || "all"}
              onValueChange={(value) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  page: 1,
                  filters: {
                    ...prev.filters,
                    emissionStatus: value,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select emission status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deleted Toggles */}
          <div className="flex items-center space-x-2">
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
            <Label htmlFor="includeDeleted" className="text-sm font-medium">
              Include Deleted
            </Label>
          </div>

          <div className="flex items-center space-x-2">
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
            <Label htmlFor="deletedOnly" className="text-sm font-medium">
              Show Only Deleted
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="space-y-6">
      {/* Stats (optional) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <CarFront className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
      </div>

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
                <FilterSheet />
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
