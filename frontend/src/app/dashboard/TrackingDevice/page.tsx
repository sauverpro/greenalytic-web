// app/(dashboard)/tracking-devices/page.tsx or wherever you need it
"use client"

import { useEffect, useState } from "react"

import type { GridColDef } from "@mui/x-data-grid"

import { PaginationParams } from "@/types"
import { TrackingDeviceListItem, TrackingDeviceListResponse } from "@/types/trackingDevicesTypes"
import { DataTable } from "@/components/dashboard/data-table"

const columns: GridColDef[] = [
  { field: "serialNumber", headerName: "Serial", flex: 1 },
  { field: "model", headerName: "Model", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "deviceCategory", headerName: "Category", flex: 1 },
  { field: "plateNumber", headerName: "Plate", flex: 1 },
  { field: "batteryLevel", headerName: "Battery", flex: 1 },
  { field: "signalStrength", headerName: "Signal", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
]

export default function TrackingDevicesPage() {
  const [data, setData] = useState<TrackingDeviceListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)

  const fetchDevices = async (params: PaginationParams) => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: params.page?.toString() || "1",
        limit: params.limit?.toString() || "10",
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        ...(params.search ? { search: params.search } : {}),
      }).toString()

      const res = await fetch(`http://localhost:4000/api/tracking-devices?${query}`)
      const json: TrackingDeviceListResponse = await res.json()
      setData(json.data.data)
      setTotalRows(json.data.meta.totalItems)
    } catch (error) {
      console.error("Failed to fetch devices:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DataTable
      title="Tracking Devices"
      columns={columns}
      data={data}
      loading={loading}
      totalRows={totalRows}
      onPaginationChange={fetchDevices}
      searchPlaceholder="Search by serial/model/plate"
    />
  )
}
