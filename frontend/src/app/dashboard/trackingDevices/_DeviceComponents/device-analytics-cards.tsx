"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Activity, Battery, Signal, TrendingUp } from "lucide-react"
import { getTopDevicesByStatus, countDevicesByStatus } from "@/services/trackingDeviceService"
import type { TrackingDeviceListItem } from "@/types/trackingDevicesTypes"

interface DeviceAnalyticsCardsProps {
  onRefresh?: () => void
}

export function DeviceAnalyticsCards({ onRefresh }: DeviceAnalyticsCardsProps) {
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    disconnected: 0,
    maintenance: 0,
  })
  const [topActiveDevices, setTopActiveDevices] = useState<TrackingDeviceListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const [totalCount, activeCount, inactiveCount, disconnectedCount, maintenanceCount, topDevices] =
        await Promise.all([
          countDevicesByStatus(),
          countDevicesByStatus("ACTIVE"),
          countDevicesByStatus("INACTIVE"),
          countDevicesByStatus("DISCONNECTED"),
          countDevicesByStatus("MAINTENANCE"),
          getTopDevicesByStatus("ACTIVE", 5),
        ])

      setDeviceStats({
        total: totalCount.count,
        active: activeCount.count,
        inactive: inactiveCount.count,
        disconnected: disconnectedCount.count,
        maintenance: maintenanceCount.count,
      })
      setTopActiveDevices(topDevices)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const getHealthPercentage = () => {
    if (deviceStats.total === 0) return 0
    return Math.round((deviceStats.active / deviceStats.total) * 100)
  }

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Total Devices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deviceStats.total}</div>
          <p className="text-xs text-muted-foreground">Fleet size</p>
        </CardContent>
      </Card>

      {/* Active Devices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <Activity className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{deviceStats.active}</div>
          <p className="text-xs text-muted-foreground">Online and operational</p>
        </CardContent>
      </Card>

      {/* Inactive Devices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          <Battery className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{deviceStats.inactive}</div>
          <p className="text-xs text-muted-foreground">Standby mode</p>
        </CardContent>
      </Card>

      {/* Disconnected Devices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disconnected</CardTitle>
          <Signal className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{deviceStats.disconnected}</div>
          <p className="text-xs text-muted-foreground">Connection lost</p>
        </CardContent>
      </Card>

      {/* Fleet Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fleet Health</CardTitle>
          <TrendingUp className={`h-4 w-4 ${getHealthColor(getHealthPercentage())}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getHealthColor(getHealthPercentage())}`}>{getHealthPercentage()}%</div>
          <p className="text-xs text-muted-foreground">Active devices ratio</p>
        </CardContent>
      </Card>
    </div>
  )
}
