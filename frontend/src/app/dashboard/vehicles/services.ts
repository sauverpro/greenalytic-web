import type { PaginationParams } from "@/types";
import type {
  PaginatedVehicleList,
  VehicleCreateRequest,
  VehicleFullDetails,
  VehicleListItemWithUser,
  VehicleUpdateRequest,
} from "./VehicleTypes";
import apiClient from "@/lib/api/axios";

// Device assignment interface - matching your Prisma schema exactly
export interface AssignDeviceToVehicleRequest {
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  deviceCategory: "MOTORCYCLE" | "CAR" | "TRUCK" | "TRICYCLE" | "OTHER"; // From your enum
  firmwareVersion?: string;
  simCardNumber?: string;
  installationDate?: string; // ISO string format
  communicationProtocol: "MQTT" | "HTTP" | "SMS"; // From your enum
  dataTransmissionInterval: string;
  vehicleId: number;
  userId?: number; // Optional, can be set from vehicle owner
}

class VehicleService {
  private baseUrl = "/vehicles";

  async listVehicles(
    params: PaginationParams & {
      filters?: Record<string, any>;
    }
  ): Promise<PaginatedVehicleList> {
    const response = await apiClient.get(`${this.baseUrl}`, { params });
    return response.data;
  }

  async getVehicleById(id: number): Promise<VehicleFullDetails> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createVehicle(data: VehicleCreateRequest) {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  async updateVehicle(id: number, data: VehicleUpdateRequest) {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteVehicle(id: number) {
    const response = await apiClient.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async softDeleteVehicle(id: number) {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/soft-delete`);
    return response.data;
  }

  async restoreVehicle(id: number) {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/restore`);
    return response.data;
  }

  async assignVehicleToUser(vehicleId: number, userId: number) {
    const response = await apiClient.patch(
      `${this.baseUrl}/${vehicleId}/assign/${userId}`
    );
    return response.data;
  }

  async getVehiclesByUser(userId: number): Promise<VehicleListItemWithUser[]> {
    const response = await apiClient.get(`${this.baseUrl}/user/${userId}`);
    return response.data;
  }

  async getTopPolluters(): Promise<VehicleListItemWithUser[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/analytics/top-polluters`
    );
    return response.data;
  }

  async countVehicles(): Promise<number> {
    const response = await apiClient.get(`${this.baseUrl}/analytics/count`);
    return response.data.count;
  }

  async countVehiclesByStatus(status: string): Promise<number> {
    const response = await apiClient.get(
      `${this.baseUrl}/analytics/count/${status}`
    );
    return response.data.count;
  }

  // NEW: Add device to vehicle - using the tracking-devices endpoint
  async addDeviceToVehicle(data: AssignDeviceToVehicleRequest): Promise<any> {
    // Format the date properly for the API
    const payload = {
      ...data,
      installationDate: data.installationDate
        ? new Date(data.installationDate).toISOString()
        : new Date().toISOString(),
    };

    console.log("Sending device payload:", payload); // Debug log

    const response = await apiClient.post("/tracking-devices", payload);
    return response.data.data;
  }

  // NEW: Get available devices (not assigned to any vehicle)
  async getAvailableDevices(): Promise<any[]> {
    const response = await apiClient.get(
      "/tracking-devices?filters[vehicleId]=null"
    );
    return response.data.data.data || [];
  }

  // NEW: Remove device from vehicle
  async removeDeviceFromVehicle(deviceId: number): Promise<void> {
    await apiClient.patch(`/tracking-devices/${deviceId}/unassign`);
  }
}

const vehicleService = new VehicleService();
export default vehicleService;
