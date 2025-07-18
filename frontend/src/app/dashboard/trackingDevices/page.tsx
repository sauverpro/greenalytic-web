"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { GridColDef } from "@mui/x-data-grid"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Filter,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Smartphone,
  Battery,
  Signal,
  Activity,
  Undo,
  Settings,
  CheckCircle,
  Circle,
} from "lucide-react"
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes"
import { listTrackingDevices, countDevicesByStatus, restoreTrackingDevice } from "@/services/trackingDeviceService"
import { UpdateAndAddDeviceSheet } from "./_DeviceComponents/UpdateAndAddDevice"
import { DeleteDeviceDialog } from "./_DeviceComponents/DeleteDeviceDialog"
import { DeviceStatusSheet } from "./_DeviceComponents/DeviceStatusSheet"
import { ViewDeviceModal } from "./_DeviceComponents/ViewDeviceModal"

import { DeviceCategory, CommunicationProtocol, DeviceStatus } from "@/types/EnumTypes"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { PaginationParams } from "@/types"
import { MonitoringFeaturesDialog } from "./_DeviceComponents/monitoring-features-dialog"

export default function TrackingDevicesPage() {
  const router = useRouter()
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 25,
    sortBy: "createdAt",
    sortOrder: "desc",
    filters: {
      status: "all",
      deviceCategory: "all",
      protocol: "all",
    },
    includeDeleted: false,
    deletedOnly: false,
  })

  const [data, setData] = useState<TrackingDeviceListItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<TrackingDeviceListItem | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [monitoringDialogOpen, setMonitoringDialogOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    disconnected: 0,
  })
  const [viewDeviceId, setViewDeviceId] = useState<number | null>(null)

  const fetchDevices = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await listTrackingDevices(paginationParams)
      setData(response.data.data || [])
      setTotalItems(response.data.meta?.totalItems || 0)
    } catch (error) {
      console.error("Failed to fetch tracking devices:", error)
    } finally {
      setIsLoading(false)
    }
  }, [paginationParams])

  const fetchDeviceStats = useCallback(async () => {
    try {
      const [totalCount, activeCount, inactiveCount, disconnectedCount] = await Promise.all([
        countDevicesByStatus(),
        countDevicesByStatus("ACTIVE"),
        countDevicesByStatus("INACTIVE"),
        countDevicesByStatus("DISCONNECTED"),
      ])

      setDeviceStats({
        total: totalCount.count,
        active: activeCount.count,
        inactive: inactiveCount.count,
        disconnected: disconnectedCount.count,
      })
    } catch (error) {
      console.error("Failed to fetch device stats:", error)
    }
  }, [])

  useEffect(() => {
    fetchDevices()
    fetchDeviceStats()
  }, [fetchDevices, fetchDeviceStats])

  const handlePaginationChange = useCallback((params: PaginationParams) => {
    setPaginationParams((prev) => {
      const merged = { ...prev, ...params }
      return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged
    })
  }, [])

  const handleViewDetails = (deviceId: number) => {
    setViewDeviceId(deviceId)
  }

  const resetFilters = () => {
    setPaginationParams((prev) => ({
      ...prev,
      page: 1,
      filters: {
        status: "all",
        deviceCategory: "all",
        protocol: "all",
      },
      includeDeleted: false,
      deletedOnly: false,
    }))
    setFilterSheetOpen(false)
  }

  const applyFilters = () => {
    setFilterSheetOpen(false)
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-600"
    if (level > 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getSignalColor = (strength: number) => {
    if (strength > 70) return "text-green-600"
    if (strength > 40) return "text-yellow-600"
    return "text-red-600"
  }

  const renderMonitoringStatus = (device: TrackingDeviceListItem) => {
    const features = [
      { key: "OBD", enabled: device.enableOBDMonitoring },
      { key: "GPS", enabled: device.enableGPSTracking },
      { key: "EMI", enabled: device.enableEmissionMonitoring },
      { key: "FUEL", enabled: device.enableFuelMonitoring },
    ]

    const enabledCount = features.filter((f) => f.enabled).length
    const totalCount = features.length

    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {features.map((feature) => (
            <div
              key={feature.key}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                feature.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
              }`}
              title={`${feature.key} Monitoring: ${feature.enabled ? "Enabled" : "Disabled"}`}
            >
              {feature.enabled ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              <span>{feature.key}</span>
            </div>
          ))}
        </div>
        <Badge variant={enabledCount > 0 ? "default" : "secondary"} className="text-xs">
          {enabledCount}/{totalCount}
        </Badge>
      </div>
    )
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
    {
      field: "serialNumber",
      headerName: "Serial Number",
      width: 150,
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: "model",
      headerName: "Model",
      width: 120,
      renderCell: (params) => <div className="text-muted-foreground">{params.value}</div>,
    },
    { field: "type", headerName: "Type", width: 100 },
    { field: "plateNumber", headerName: "Plate", width: 120 },
    {
      field: "batteryLevel",
      headerName: "Battery",
      width: 100,
      renderCell: (params) => (
        <div className={`flex items-center gap-1 ${getBatteryColor(params.value)}`}>
          <Battery className="h-4 w-4" />
          <span className="font-medium">{params.value}%</span>
        </div>
      ),
    },
    {
      field: "signalStrength",
      headerName: "Signal",
      width: 100,
      renderCell: (params) => (
        <div className={`flex items-center gap-1 ${getSignalColor(params.value)}`}>
          <Signal className="h-4 w-4" />
          <span className="font-medium">{params.value}%</span>
        </div>
      ),
    },
    {
      field: "monitoring",
      headerName: "Monitoring",
      width: 320,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const device = params.row as TrackingDeviceListItem
        return renderMonitoringStatus(device)
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const device = params.row as TrackingDeviceListItem
        const isDeleted = device.deletedAt !== null
        if (isDeleted) {
          return <Badge variant="destructive">DELETED</Badge>
        }
        const variant =
          params.value === "ACTIVE" ? "default" : params.value === "INACTIVE" ? "secondary" : "destructive"
        return <Badge variant={variant}>{params.value}</Badge>
      },
    },
    {
      field: "deviceCategory",
      headerName: "Category",
      width: 120,
      renderCell: (params) => (
        <Badge variant="outline" className="font-medium">
          {params.value}
        </Badge>
      ),
    },
    {
      field: "lastPing",
      headerName: "Last Ping",
      width: 120,
      renderCell: (params) => (
        <div className="text-muted-foreground text-sm">
          {params.value ? new Date(params.value).toLocaleDateString() : "Never"}
        </div>
      ),
    },
    {
      field: "deletedAt",
      headerName: "Deleted",
      width: 120,
      renderCell: (params) => (
        <div className="text-muted-foreground text-sm">
          {params.value ? new Date(params.value).toLocaleDateString() : "—"}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const device = params.row as TrackingDeviceListItem
        const isDeleted = device.deletedAt !== null
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(device.id)}
              className="h-8 w-8 p-0"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!isDeleted && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDevice(device)
                    setEditDialogOpen(true)
                  }}
                  className="h-8 w-8 p-0"
                  title="Edit Device"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDevice(device)
                    setStatusDialogOpen(true)
                  }}
                  className="h-8 w-8 p-0"
                  title="Update Status"
                >
                  <Activity className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDevice(device)
                    setMonitoringDialogOpen(true)
                  }}
                  className="h-8 w-8 p-0"
                  title="Configure Monitoring"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            )}
            {isDeleted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestoreDevice(device)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                title="Restore Device"
              >
                <Undo className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDevice(device)
                  setDeleteDialogOpen(true)
                }}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Delete Device"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const FilterPopover = () => (
    <Popover open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] sm:w-[440px] max-h-[500px] overflow-y-auto">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Filter Tracking Devices</h3>
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
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(DeviceStatus).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {value.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Device Category Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Device Category</Label>
            <Select
              value={paginationParams.filters?.deviceCategory || "all"}
              onValueChange={(value) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  page: 1,
                  filters: {
                    ...prev.filters,
                    deviceCategory: value,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(DeviceCategory).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {value.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Communication Protocol Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Protocol</Label>
            <Select
              value={paginationParams.filters?.protocol || "all"}
              onValueChange={(value) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  page: 1,
                  filters: {
                    ...prev.filters,
                    protocol: value,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Protocols</SelectItem>
                {Object.entries(CommunicationProtocol).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Deleted Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Deleted Items</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
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
                <Label htmlFor="includeDeleted" className="text-sm">
                  Include Deleted Devices
                </Label>
              </div>
              <div className="flex items-center gap-2">
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
                <Label htmlFor="deletedOnly" className="text-sm">
                  Only Deleted Devices
                </Label>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={applyFilters} className="flex-1">
              Apply
            </Button>
            <Button variant="outline" onClick={resetFilters} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  const handleRestoreDevice = async (device: TrackingDeviceListItem) => {
    try {
      await restoreTrackingDevice(device.id)
      toast.success(`Device ${device.serialNumber} restored successfully`)
      fetchDevices()
      fetchDeviceStats()
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to restore device"
      toast.error(errorMsg)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deviceStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Battery className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{deviceStats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disconnected</CardTitle>
            <Signal className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deviceStats.disconnected}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            title="Tracking Devices"
            columns={columns}
            data={data}
            loading={isLoading}
            totalRows={totalItems}
            onPaginationChange={handlePaginationChange}
            searchPlaceholder="Search by serial/model/plate..."
            filters={paginationParams.filters}
            customFilters={
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                  <FilterPopover />
                  <UpdateAndAddDeviceSheet onDeviceCreated={fetchDevices} />
                </div>
              </div>
            }
          />
        </CardContent>
      </Card>

      {selectedDevice && (
        <>
          <UpdateAndAddDeviceSheet
            deviceId={selectedDevice.id}
            isEditing={true}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onDeviceUpdated={fetchDevices}
          />
          <DeleteDeviceDialog
            device={selectedDevice}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onDeleted={fetchDevices}
          />
          <DeviceStatusSheet
            device={selectedDevice}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onStatusUpdated={fetchDevices}
          />
          <MonitoringFeaturesDialog
            device={selectedDevice}
            open={monitoringDialogOpen}
            onOpenChange={setMonitoringDialogOpen}
            onFeaturesUpdated={fetchDevices}
          />
        </>
      )}

      <ViewDeviceModal
        deviceId={viewDeviceId}
        open={viewDeviceId !== null}
        onOpenChange={(open) => {
          if (!open) setViewDeviceId(null)
        }}
      />
    </div>
  )
}
