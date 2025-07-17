import apiClient from "@/lib/api/axios";
import { PaginationParams } from "@/types";
import type {
  TrackingDeviceListResponse,
  TrackingDeviceListItem
} from "@/types/trackingDevicesTypes";

export interface TrackingDeviceCreateDTO {
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  deviceCategory: string;
  firmwareVersion?: string;
  simCardNumber?: string;
  communicationProtocol: string;
  dataTransmissionInterval: string;
  userId?: number;
  vehicleId?: number;
}

export interface TrackingDeviceUpdateDTO {
  model?: string;
  type?: string;
  plateNumber?: string;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
  simCardNumber?: string;
  communicationProtocol?: string;
  dataTransmissionInterval?: string;
  enableOBDMonitoring?: boolean;
  enableGPSTracking?: boolean;
  enableEmissionMonitoring?: boolean;
  enableFuelMonitoring?: boolean;
  status?: string;
  userId?: number;
  vehicleId?: number | null;
}

export interface DeviceStatusUpdateDTO {
  status: string;
  force?: boolean;
  disableMonitoring?: boolean;
}

export interface BatchStatusUpdateDTO {
  deviceIds: number[];
  status: string;
  force?: boolean;
  disableMonitoring?: boolean;
}

export interface MonitoringFeatureDTO {
  obd?: boolean;
  gps?: boolean;
  emission?: boolean;
  fuel?: boolean;
  ignoreStatusCheck?: boolean;
}

export interface HeartbeatDTO {
  batteryLevel?: number;
  signalStrength?: number;
  status: string;
}

export interface BulkCreateDeviceDTO {
  devices: Array<{
    serialNumber: string;
    model: string;
    type: string;
    plateNumber: string;
    deviceCategory: string;
    firmwareVersion?: string;
    simCardNumber?: string;
    communicationProtocol: string;
    dataTransmissionInterval: string;
    userId?: number;
  }>;
}

// Basic CRUD Operations
export const createTrackingDevice = async (
  data: TrackingDeviceCreateDTO
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.post("/tracking-devices", data);
  return response.data.data;
};

export const getTrackingDeviceById = async (
  id: number
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.get(`/tracking-devices/${id}`);
  return response.data.data;
};

export const updateTrackingDevice = async (
  id: number,
  data: TrackingDeviceUpdateDTO
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.put(`/tracking-devices/${id}`, data);
  return response.data.data;
};

export const softDeleteTrackingDevice = async (id: number): Promise<void> => {
  await apiClient.patch(`/tracking-devices/${id}/soft-delete`);
};

export const restoreTrackingDevice = async (id: number): Promise<void> => {
  await apiClient.patch(`/tracking-devices/${id}/restore`);
};

export const deleteTrackingDevicePermanently = async (
  id: number
): Promise<void> => {
  await apiClient.delete(`/tracking-devices/${id}`);
};

// List and Search Operations
export const listTrackingDevices = async (
  params: PaginationParams
): Promise<TrackingDeviceListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  // Add filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        queryParams.append(key, value.toString());
      }
    });
  }

  const response = await apiClient.get(
    `/tracking-devices?${queryParams.toString()}`
  );
  return response.data;
};

export const getTrackingDeviceBySerialNumber = async (
  serialNumber: string
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.get(
    `/tracking-devices/serial/${serialNumber}`
  );
  return response.data.data;
};

export const bulkCreateTrackingDevices = async (
  data: BulkCreateDeviceDTO
): Promise<TrackingDeviceListItem[]> => {
  const response = await apiClient.post("/tracking-devices/bulk", data);
  return response.data.data;
};

// Device Assignment Operations
export const assignDeviceToVehicle = async (
  deviceId: number,
  vehicleId: number
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.patch(
    `/tracking-devices/${deviceId}/assign/${vehicleId}`
  );
  return response.data.data;
};

export const unassignDeviceFromVehicle = async (
  deviceId: number
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.patch(
    `/tracking-devices/${deviceId}/unassign`
  );
  return response.data.data;
};

// Status Management
export const updateDeviceStatus = async (
  deviceId: number,
  data: DeviceStatusUpdateDTO
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.patch(
    `/tracking-devices/${deviceId}/status`,
    data
  );
  return response.data.data;
};

export const batchUpdateDeviceStatuses = async (
  data: BatchStatusUpdateDTO
): Promise<any> => {
  const response = await apiClient.post("/tracking-devices/batch/status", data);
  return response.data.data;
};

// Monitoring Feature Control
export const toggleMonitoringFeature = async (
  deviceId: number,
  feature: MonitoringFeatureDTO
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.patch(
    `/tracking-devices/${deviceId}/monitoring-features`,
    feature
  );
  return response.data.data;
};

export const getMonitoringFeatures = async (deviceId: number): Promise<any> => {
  const response = await apiClient.get(
    `/tracking-devices/${deviceId}/monitoring-features`
  );
  return response.data.data;
};

export const resetAllMonitoringFeatures = async (
  deviceId: number
): Promise<TrackingDeviceListItem> => {
  const response = await apiClient.patch(
    `/tracking-devices/${deviceId}/reset-monitoring-features`
  );
  return response.data.data;
};

// Heartbeat and Connection Management
export const recordDeviceHeartbeat = async (
  deviceId: number,
  data: HeartbeatDTO
): Promise<any> => {
  const response = await apiClient.post(
    `/tracking-devices/${deviceId}/heartbeat`,
    data
  );
  return response.data.data;
};

export const getDeviceHealth = async (
  deviceId: number,
  hoursBack?: number
): Promise<any> => {
  const params = hoursBack ? `?hoursBack=${hoursBack}` : "";
  const response = await apiClient.get(
    `/tracking-devices/${deviceId}/health${params}`
  );
  return response.data.data;
};

// Analytics and Reporting
export const getTopDevicesByStatus = async (
  status: string,
  limit?: number
): Promise<TrackingDeviceListItem[]> => {
  const params = limit ? `?limit=${limit}` : "";
  const response = await apiClient.get(
    `/tracking-devices/analytics/top/${status}${params}`
  );
  return response.data.data;
};

export const countDevicesByStatus = async (
  status?: string
): Promise<{ count: number }> => {
  const params = status ? `?status=${status}` : "";
  const response = await apiClient.get(
    `/tracking-devices/analytics/count${params}`
  );
  return response.data.data;
};

export const getDeviceStatusHistory = async (
  deviceId: number,
  daysBack?: number
): Promise<any[]> => {
  const params = daysBack ? `?daysBack=${daysBack}` : "";
  const response = await apiClient.get(
    `/tracking-devices/${deviceId}/history/status${params}`
  );
  return response.data.data;
};
