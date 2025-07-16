import { CommunicationProtocol, ConnectionStatus, DeviceStatus, EmissionStatus, FuelType, VehicleStatus } from "@/types/EnumTypes";
import { UserBasicInfo } from "../users/UserTypes";

// Basic summary for listings
export interface VehicleListItemWithUser {
  id: number;
  plateNumber: string;
  vehicleModel: string;
  yearOfManufacture: number;
  vehicleType: string;
  usage: string;
  registrationNumber?: string;
  chassisNumber?: string;
  fuelType?: FuelType;
  status: VehicleStatus;
  emissionStatus: EmissionStatus;
  lastMaintenanceDate?: string;
  user: UserBasicInfo;
}

// Create request payload
export interface VehicleCreateRequest {
  plateNumber: string;
  registrationNumber?: string;
  chassisNumber?: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: number;
  usage: string;
  fuelType?: FuelType;
  lastMaintenanceDate?: string;
  userId: number;
}

// Update request payload
export interface VehicleUpdateRequest {
  registrationNumber?: string;
  chassisNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  usage?: string;
  fuelType?: FuelType;
  status?: VehicleStatus;
  emissionStatus?: EmissionStatus;
  lastMaintenanceDate?: string;
  userId?: number;
}

// Full details for view pages
export interface VehicleFullDetails {
  id: number;
  plateNumber: string;
  registrationNumber?: string;
  chassisNumber?: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: number;
  usage: string;
  fuelType?: FuelType;
  status: VehicleStatus;
  emissionStatus: EmissionStatus;
  lastMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  user: UserBasicInfo;

  trackingDevices: {
    id: number;
    serialNumber: string;
    status: DeviceStatus;
    firmwareVersion?: string;
    communicationProtocol: CommunicationProtocol;
  }[];

  emissionData: {
    id: number;
    timestamp: string;
    co2Percentage: number;
    noxPPM?: number;
    pm25Level?: number;
  }[];

  gpsData: {
    id: number;
    timestamp: string;
    latitude: number;
    longitude: number;
    speed: number;
    accuracy?: number;
  }[];

  fuelData: {
    id: number;
    timestamp: string;
    fuelLevel: number;
    fuelConsumption: number;
  }[];

  obdData: {
    id: number;
    timestamp: string;
    faultCodes: string[];
    rpm?: number;
    engineTemperature?: number;
  }[];

  alerts: {
    id: number;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }[];

  maintenanceRecords: {
    id: number;
    type: string;
    description?: string;
    performedAt: string;
    nextDueDate?: string;
    recommendedAction?: string;
  }[];

  connectionState?: {
    status: ConnectionStatus;
    socketId: string;
    lastUpdated: string;
  };
}

// List response with pagination
export interface PaginatedVehicleList {
  data: VehicleListItemWithUser[];
  pagination: {
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
  };
}
