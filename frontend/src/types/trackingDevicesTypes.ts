// types/tracking-device.ts

export interface TrackingDeviceUser {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN" | "FLEET_MANAGER" | string;
}

export interface TrackingDeviceVehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
}
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  sortBy?: string;
  sortOrder?: string;
}
export interface TrackingDeviceListItem {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  batteryLevel: number;
  signalStrength: number;
  deviceCategory: string;
  firmwareVersion: string;
  simCardNumber: string;
  installationDate: string;
  communicationProtocol: string;
  dataTransmissionInterval: string;
  enableOBDMonitoring: boolean;
  enableGPSTracking: boolean;
  enableEmissionMonitoring: boolean;
  enableFuelMonitoring: boolean;
  isActive: boolean;
  status: "ACTIVE" | "INACTIVE" | string;
  lastPing: string;
  userId: number;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: TrackingDeviceUser;
  vehicle: TrackingDeviceVehicle;
}
export interface TrackingDeviceListResponse {
  success: boolean;
  message: string;
  data: {
    data: TrackingDeviceListItem[];
    meta: PaginationMeta;
  };
}