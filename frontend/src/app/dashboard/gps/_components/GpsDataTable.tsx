"use client"

import { useState } from "react"
import type { GridColDef } from "@mui/x-data-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Eye, Edit, Trash2, Filter, Download } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { GpsDataQueryParams, GpsDataResponseDTO } from "./gpsTypes"
import { PaginationParams } from "@/types"
import gpsService from "./gpsService"
import { DataTable } from "@/components/dashboard/data-table"

interface GpsDataTableProps {
  onViewOnMap?: (gpsData: GpsDataResponseDTO) => void
  onEdit?: (gpsData: GpsDataResponseDTO) => void
  onDelete?: (id: number) => void
  initialFilters?: Partial<GpsDataQueryParams>
}

export function GpsDataTable({ onViewOnMap, onEdit, onDelete, initialFilters = {} }: GpsDataTableProps) {
  const [data, setData] = useState<GpsDataResponseDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Filters state
  const [filters, setFilters] = useState<GpsDataQueryParams>(initialFilters)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = 
      async (params: PaginationParams) => {
      setLoading(true)
      setError(null)

      try {
        const queryParams: GpsDataQueryParams = {
          ...params,
          ...filters,
          startTime: startDate,
          endTime: endDate,
        }

        const response = await gpsService.getAllGpsData(queryParams)
        setData(response.data)
        setTotalRows(response.meta.totalItems)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch GPS data")
        console.error("Error fetching GPS data:", err)
      } finally {
        setLoading(false)
      }
    }



  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const getSpeedLevelColor = (speedLevel?: string) => {
    switch (speedLevel) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "secondary"
      case "NORMAL":
      default:
        return "default"
    }
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      type: "number",
    },
    {
      field: "plateNumber",
      headerName: "Plate Number",
      width: 120,
      renderCell: (params) => (
        <Badge variant="outline" className="font-mono">
          {params.value}
        </Badge>
      ),
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{params.value?.vehicleModel || "Unknown"}</span>
          <span className="text-xs text-muted-foreground">{params.value?.vehicleType || "N/A"}</span>
        </div>
      ),
    },
    {
      field: "latitude",
      headerName: "Latitude",
      width: 100,
      type: "number",
      renderCell: (params) => <span className="font-mono text-xs">{params.value?.toFixed(6)}</span>,
    },
    {
      field: "longitude",
      headerName: "Longitude",
      width: 100,
      type: "number",
      renderCell: (params) => <span className="font-mono text-xs">{params.value?.toFixed(6)}</span>,
    },
    {
      field: "speed",
      headerName: "Speed (km/h)",
      width: 120,
      type: "number",
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{params.value}</span>
          <Badge variant={getSpeedLevelColor(params.row.speedLevel)} className="text-xs">
            {params.row.speedLevel || "NORMAL"}
          </Badge>
        </div>
      ),
    },
    {
      field: "accuracy",
      headerName: "Accuracy (m)",
      width: 100,
      type: "number",
      renderCell: (params) => (
        <span
          className={cn(
            "font-medium",
            params.value > 50 ? "text-red-600" : params.value > 20 ? "text-yellow-600" : "text-green-600",
          )}
        >
          {params.value || "N/A"}
        </span>
      ),
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 160,
      type: "dateTime",
      renderCell: (params) => (
        <div className="flex flex-col">
          <span className="text-sm">{format(new Date(params.value), "MMM dd, yyyy")}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(params.value), "HH:mm:ss")}</span>
        </div>
      ),
    },
    {
      field: "trackingStatus",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Badge variant={params.value ? "default" : "secondary"}>{params.value ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          {onViewOnMap && (
            <Button variant="ghost" size="sm" onClick={() => onViewOnMap(params.row)} title="View on Map">
              <MapPin className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              /* Handle view details */
            }}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(params.row)} title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(params.row.id)}
              title="Delete"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]
const  gpsQueryToRecord = (query: GpsDataQueryParams): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  for (const key in query) {
    const value = query[key as keyof GpsDataQueryParams]
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result
}
  const customFilters = (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      {showFilters && (
        <>
          {/* Vehicle ID Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="vehicleId" className="text-sm whitespace-nowrap">
              Vehicle ID:
            </Label>
            <Input
              id="vehicleId"
              type="number"
              placeholder="Vehicle ID"
              value={filters.vehicleId || ""}
              onChange={(e) =>
                handleFilterChange("vehicleId", e.target.value ? Number.parseInt(e.target.value) : undefined)
              }
              className="w-24"
            />
          </div>

          {/* Speed Level Filter */}
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">Speed Level:</Label>
            <Select
              value={filters.speedLevel || "all"}
              onValueChange={(value) => handleFilterChange("speedLevel", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filters */}
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">From:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-32 justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMM dd") : "Start"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">To:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-32 justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMM dd") : "End"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear
          </Button>
        </>
      )}
    </div>
  )

  const additionalHeaderContent = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  )

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading GPS Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => fetchData({ page: 1, limit: 25 })} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <DataTable
      title="GPS Tracking Data"
      columns={columns}
      data={data}
      loading={loading}
      totalRows={totalRows}
      onPaginationChange={fetchData}
      customFilters={customFilters}
      additionHeaderContent={additionalHeaderContent}
      searchPlaceholder="Search by plate number..."
 filters={gpsQueryToRecord(filters)}
    />
  )
}
