import { PaginationMeta } from "@/types"
import {
  CreateGpsDataDTO,
  GpsDataQueryParams,
  GpsDataResponseDTO,
  GpsDataWithRouteAnalysisDTO,
  GpsStatisticsResponseDTO,
  LocationRadiusResponseDTO,
  SpeedRangeResponseDTO,
  SpeedThresholds,
  UpdateGpsDataDTO,
} from "./gpsTypes"
import apiClient from "@/lib/api/axios"


class GpsService {
  async getAllGpsData(params: GpsDataQueryParams = {}) {
    const response = await apiClient.get<{
      data: GpsDataResponseDTO[]
      meta: PaginationMeta
    }>("/gps", { params })
    return response.data
  }

  async createGpsData(data: CreateGpsDataDTO) {
    const response = await apiClient.post<{
      message: string
      data: GpsDataResponseDTO
      speedViolation: boolean
      alertsGenerated: number
    }>("/gps", data)
    return response.data
  }

  async getGpsDataById(id: number) {
    const response = await apiClient.get<GpsDataWithRouteAnalysisDTO>(`/gps/${id}`)
    return response.data
  }

  async updateGpsData(id: number, data: UpdateGpsDataDTO) {
    const response = await apiClient.put<GpsDataResponseDTO>(`/gps/${id}`, data)
    return response.data
  }

  async deleteGpsData(id: number) {
    await apiClient.delete(`/gps/${id}`)
  }

  async getGpsDataByVehicle(vehicleId: number, params: Omit<GpsDataQueryParams, "vehicleId"> = {}) {
    const response = await apiClient.get<{
      data: GpsDataResponseDTO[]
      meta: PaginationMeta
    }>(`/gps/vehicle/${vehicleId}`, { params })
    return response.data
  }

  async getGpsDataByVehicleInterval(
    vehicleId: number,
    interval: string,
    intervalValue: string,
    params: Omit<GpsDataQueryParams, "vehicleId" | "interval" | "intervalValue"> = {},
  ) {
    const fullParams = {
      interval,
      value: intervalValue,
      ...params,
    }
    const response = await apiClient.get<{
      data: GpsDataResponseDTO[]
      meta: PaginationMeta
    }>(`/gps/vehicle/${vehicleId}/interval`, { params: fullParams })
    return response.data
  }

  async getGpsDataByPlateNumber(plateNumber: string, params: Omit<GpsDataQueryParams, "plateNumber"> = {}) {
    const response = await apiClient.get<{
      data: GpsDataResponseDTO[]
      meta: PaginationMeta
    }>(`/gps/plate/${plateNumber}`, { params })
    return response.data
  }

  async getGpsDataByLocationRadius(
    centerLatitude: number,
    centerLongitude: number,
    radiusKm: number,
    params: Omit<GpsDataQueryParams, "centerLatitude" | "centerLongitude" | "radiusKm"> = {},
  ) {
    const fullParams = {
      centerLatitude,
      centerLongitude,
      radiusKm,
      ...params,
    }

    const response = await apiClient.get<LocationRadiusResponseDTO>(`/gps/location/radius`, {
      params: fullParams,
    })
    return response.data
  }

  async getGpsDataBySpeedRange(minSpeed: number, maxSpeed: number, params: Omit<GpsDataQueryParams, "minSpeed" | "maxSpeed"> = {}) {
    const fullParams = { minSpeed, maxSpeed, ...params }
    const response = await apiClient.get<SpeedRangeResponseDTO>(`/gps/speed/range`, {
      params: fullParams,
    })
    return response.data
  }

  async getGpsStatistics(params: {
    vehicleId?: number
    interval?: string
    startTime?: Date
    endTime?: Date
  } = {}) {
    const queryParams: Record<string, string> = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value instanceof Date) {
        queryParams[key] = value.toISOString()
      } else if (value !== undefined && value !== null) {
        queryParams[key] = String(value)
      }
    })

    const response = await apiClient.get<GpsStatisticsResponseDTO>("/gps/statistics", {
      params: queryParams,
    })
    return response.data
  }

  async getSpeedThresholds() {
    const response = await apiClient.get<SpeedThresholds>("/gps/config/thresholds")
    return response.data
  }

  async healthCheck() {
    const response = await apiClient.get<{ status: string; timestamp: string }>("/gps/health")
    return response.data
  }

  async getRealTimeGpsData(vehicleIds?: number[]): Promise<GpsDataResponseDTO[]> {
    const params: Record<string, string> = {
      limit: "1000",
      sortBy: "timestamp",
      sortOrder: "desc",
    }

    if (vehicleIds?.length) {
      params.vehicleIds = vehicleIds.join(",")
    }

    const response = await this.getAllGpsData(params as GpsDataQueryParams)
    return response.data
  }

  async getVehicleRoute(vehicleId: number, startTime: Date, endTime: Date): Promise<GpsDataResponseDTO[]> {
    const response = await this.getGpsDataByVehicle(vehicleId, {
      startTime,
      endTime,
      limit: 1000,
      sortBy: "timestamp",
      sortOrder: "asc",
    })

    return response.data
  }
}

export const gpsService = new GpsService()
export default gpsService
