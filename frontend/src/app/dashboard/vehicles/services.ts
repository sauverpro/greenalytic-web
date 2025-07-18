import { PaginationParams } from "@/types";
import { PaginatedVehicleList, VehicleCreateRequest, VehicleFullDetails, VehicleListItemWithUser, VehicleUpdateRequest } from "./VehicleTypes";
import apiClient from "@/lib/api/axios";



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
    const response = await apiClient.get(`${this.baseUrl}/analytics/top-polluters`);
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
}

const vehicleService = new VehicleService();
export default vehicleService;
