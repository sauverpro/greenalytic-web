"use client"

import { useState, useEffect, useCallback } from "react"
import { GpsDataQueryParams, GpsDataResponseDTO } from "./gpsTypes"
import { PaginationParams } from "@/types"
import gpsService from "./gpsService"


export function useGpsData(initialParams: GpsDataQueryParams = {}) {
  const [data, setData] = useState<GpsDataResponseDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [params, setParams] = useState<GpsDataQueryParams>(initialParams)

  const fetchData = useCallback(
    async (newParams?: PaginationParams) => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = { ...params, ...newParams }
        const response = await gpsService.getAllGpsData(queryParams)

        setData(response.data)
        setTotalItems(response.meta.totalItems)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch GPS data")
        console.error("Error fetching GPS data:", err)
      } finally {
        setLoading(false)
      }
    },
    [params],
  )

  const updateParams = useCallback((newParams: Partial<GpsDataQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }))
  }, [])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    totalItems,
    params,
    updateParams,
    refresh,
    fetchData,
  }
}

export function useRealTimeGpsData(vehicleIds?: number[], refreshInterval = 30000) {
  const [vehicles, setVehicles] = useState<GpsDataResponseDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(true)

  const fetchRealTimeData = useCallback(async () => {
    if (!isActive) return

    setLoading(true)
    setError(null)

    try {
      const data = await gpsService.getRealTimeGpsData(vehicleIds)
      setVehicles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch real-time data")
      console.error("Error fetching real-time GPS data:", err)
    } finally {
      setLoading(false)
    }
  }, [vehicleIds, isActive])

  useEffect(() => {
    if (!isActive) return

    fetchRealTimeData()
    const interval = setInterval(fetchRealTimeData, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchRealTimeData, refreshInterval, isActive])

  const start = useCallback(() => setIsActive(true), [])
  const stop = useCallback(() => setIsActive(false), [])

  return {
    vehicles,
    loading,
    error,
    isActive,
    start,
    stop,
    refresh: fetchRealTimeData,
  }
}
