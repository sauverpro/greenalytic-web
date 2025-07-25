import { PaginationMeta } from "@/types"
import { CreateGpsDataDTO, GpsDataQueryParams, GpsDataResponseDTO, GpsDataWithRouteAnalysisDTO, GpsStatisticsResponseDTO, LocationRadiusResponseDTO, SpeedRangeResponseDTO, SpeedThresholds, UpdateGpsDataDTO } from "./gpsTypes"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

class GpsService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Get all GPS data with filters and pagination
  async getAllGpsData(params: GpsDataQueryParams = {}): Promise<{
    data: GpsDataResponseDTO[]
    meta: PaginationMeta
  }> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps${queryString ? `?${queryString}` : ""}`

    return this.request<{ data: GpsDataResponseDTO[]; meta: PaginationMeta }>(endpoint)
  }

  // Create new GPS data
  async createGpsData(data: CreateGpsDataDTO): Promise<{
    message: string
    data: GpsDataResponseDTO
    speedViolation: boolean
    alertsGenerated: number
  }> {
    return this.request("/gps", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Get GPS data by ID with route analysis
  async getGpsDataById(id: number): Promise<GpsDataWithRouteAnalysisDTO> {
    return this.request(`/gps/${id}`)
  }

  // Update GPS data
  async updateGpsData(id: number, data: UpdateGpsDataDTO): Promise<GpsDataResponseDTO> {
    return this.request(`/gps/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Delete GPS data
  async deleteGpsData(id: number): Promise<void> {
    return this.request(`/gps/${id}`, {
      method: "DELETE",
    })
  }

  // Get GPS data by vehicle ID
  async getGpsDataByVehicle(
    vehicleId: number,
    params: Omit<GpsDataQueryParams, "vehicleId"> = {},
  ): Promise<{
    data: GpsDataResponseDTO[]
    meta: PaginationMeta
  }> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps/vehicle/${vehicleId}${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  // Get GPS data by vehicle with interval filtering
  async getGpsDataByVehicleInterval(
    vehicleId: number,
    interval: string,
    intervalValue: string,
    params: Omit<GpsDataQueryParams, "vehicleId" | "interval" | "intervalValue"> = {},
  ): Promise<{
    data: GpsDataResponseDTO[]
    meta: PaginationMeta
  }> {
    const searchParams = new URLSearchParams({
      interval,
      value: intervalValue,
    })

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps/vehicle/${vehicleId}/interval?${queryString}`

    return this.request(endpoint)
  }

  // Get GPS data by plate number
  async getGpsDataByPlateNumber(
    plateNumber: string,
    params: Omit<GpsDataQueryParams, "plateNumber"> = {},
  ): Promise<{
    data: GpsDataResponseDTO[]
    meta: PaginationMeta
  }> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps/plate/${plateNumber}${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  // Get GPS data within location radius
  async getGpsDataByLocationRadius(
    centerLatitude: number,
    centerLongitude: number,
    radiusKm: number,
    params: Omit<GpsDataQueryParams, "centerLatitude" | "centerLongitude" | "radiusKm"> = {},
  ): Promise<LocationRadiusResponseDTO> {
    const searchParams = new URLSearchParams({
      centerLatitude: String(centerLatitude),
      centerLongitude: String(centerLongitude),
      radiusKm: String(radiusKm),
    })

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps/location/radius?${queryString}`

    return this.request(endpoint)
  }

  // Get GPS data within speed range
  async getGpsDataBySpeedRange(
    minSpeed: number,
    maxSpeed: number,
    params: Omit<GpsDataQueryParams, "minSpeed" | "maxSpeed"> = {},
  ): Promise<SpeedRangeResponseDTO> {
    const searchParams = new URLSearchParams({
      minSpeed: String(minSpeed),
      maxSpeed: String(maxSpeed),
    })

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps/speed/range?${queryString}`

    return this.request(endpoint)
  }

  // Get GPS statistics
  async getGpsStatistics(
    params: {
      vehicleId?: number
      interval?: string
      startTime?: Date
      endTime?: Date
    } = {},
  ): Promise<GpsStatisticsResponseDTO> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/gps/statistics${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  // Get speed thresholds configuration
  async getSpeedThresholds(): Promise<SpeedThresholds> {
    return this.request("/gps/config/thresholds")
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request("/gps/health")
  }

  // Get real-time GPS data for map tracking
  async getRealTimeGpsData(vehicleIds?: number[]): Promise<GpsDataResponseDTO[]> {
    const params = new URLSearchParams({
      limit: "1000", // Get more data for real-time tracking
      sortBy: "timestamp",
      sortOrder: "desc",
    })

    if (vehicleIds && vehicleIds.length > 0) {
      // Filter by specific vehicles if provided
      params.append("vehicleIds", vehicleIds.join(","))
    }

    const response = await this.getAllGpsData(Object.fromEntries(params))
    return response.data
  }

  // Get vehicle route data for map visualization
  async getVehicleRoute(vehicleId: number, startTime: Date, endTime: Date): Promise<GpsDataResponseDTO[]> {
    const response = await this.getGpsDataByVehicle(vehicleId, {
      startTime,
      endTime,
      limit: 1000, // Get all points for route
      sortBy: "timestamp",
      sortOrder: "asc",
    })

    return response.data
  }
}

export const gpsService = new GpsService()
export default gpsService
