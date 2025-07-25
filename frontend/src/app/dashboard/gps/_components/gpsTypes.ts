import { PaginationParams } from "@/types";

// Frontend types matching your backend DTOs
export interface CreateGpsDataDTO {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy?: number;
  vehicleId: number;
  plateNumber: string;
  trackingDeviceId?: number;
  trackingStatus?: boolean;
  timestamp?: Date;
}

export interface UpdateGpsDataDTO {
  latitude?: number;
  longitude?: number;
  speed?: number;
  accuracy?: number;
  plateNumber?: string;
  trackingStatus?: boolean;
  timestamp?: Date;
}

export interface GpsDataResponseDTO {
  id: number;
  latitude: number;
  longitude: number;
  speed: number;
  accuracy?: number | null;
  plateNumber: string;
  vehicleId: number;
  trackingDeviceId?: number | null;
  trackingStatus: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  speedLevel?: "NORMAL" | "HIGH" | "CRITICAL";
  exceedsSpeedLimit?: boolean;
  distanceFromPrevious?: number;
  vehicle?: {
    plateNumber: string;
    vehicleModel: string;
    vehicleType: string;
    status: string;
    fuelType: string | null;
  };
  trackingDevice?: {
    serialNumber: string;
    model: string;
    deviceCategory: string;
    status: string;
  };
}

export interface GpsStatisticsResponseDTO {
  data: {
    summary: {
      totalRecords: number;
      totalDistanceKm: number;
      averageSpeed: string;
      maxSpeed: number;
      speedViolations: number;
      speedViolationPercentage: string;
    };
    speedAnalysis: {
      normal: number;
      high: number;
      critical: number;
      normalPercentage: string;
      highPercentage: string;
      criticalPercentage: string;
    };
    locationCoverage: {
      minLatitude: number;
      maxLatitude: number;
      minLongitude: number;
      maxLongitude: number;
      boundingBoxArea: number;
    };
    thresholds: SpeedThresholds;
    timeRange: {
      interval?: string;
      from?: string | Date;
      to?: string | Date;
    };
  };
}

export interface SpeedThresholds {
  speed: { warning: number; critical: number };
  accuracy: { minimum: number };
  tracking: { interval: number };
}

export interface GpsDataWithRouteAnalysisDTO extends GpsDataResponseDTO {
  routeAnalysis: {
    distanceFromStart: number;
    timeFromStart: string;
    bearing: number;
    speedChange: number;
    isStationary: boolean;
    estimatedAddress?: string;
  };
  thresholds: SpeedThresholds;
}

export interface LocationRadiusResponseDTO {
  data: GpsDataResponseDTO[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    searchRadius: {
      centerLatitude: number;
      centerLongitude: number;
      radiusKm: number;
      searchAreaKm2: number;
    };
  };
}

export interface SpeedRangeResponseDTO {
  data: GpsDataResponseDTO[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    speedRange: {
      minSpeed: number;
      maxSpeed: number;
      averageSpeed: number;
      violationsFound: number;
    };
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}



export interface GpsDataQueryParams extends PaginationParams {
  vehicleId?: number;
  plateNumber?: string;
  trackingDeviceId?: number;
  startTime?: Date;
  endTime?: Date;
  vehicleStatus?: string;
  speedLevel?: string;
  minSpeed?: number;
  maxSpeed?: number;
  centerLatitude?: number;
  centerLongitude?: number;
  radiusKm?: number;
  interval?: string;
  intervalValue?: string;
}
