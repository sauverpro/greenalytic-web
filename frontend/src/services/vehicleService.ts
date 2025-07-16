import useAxiosClient from "@/hooks/axiosClient";
import apiClient from "@/lib/api/axios";
import { Vehicle, EmissionData } from "@/types/types";


export const addVehicleToUser = async (
  userId: number,
  vehicleData: Vehicle
) => {
  try {
    const response = await apiClient.post(`/vehicles/add/${userId}`, vehicleData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add vehicle to user: ${error}`);
  }
};

export const getVehiclesForUser = async (userId: number) => {
  try {
    const response = await apiClient.get(`/vehicles/user/${userId}/vehicles`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
};

export const getVehiclesByLoggedUser = async () => {
  try {
    const response = await apiClient.get("/vehicles");
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user vehicles: ${error}`);
  }
};

export const getAllVehicles = async () => {
  try {
    const response = await apiClient.get(`/vehicles/all`);
    return response.data.vehicles;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
};

export const getVehicleById = async (vehicleId: number) => {
  try {
    const response = await apiClient.get(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicle: ${error}`);
  }
};

export const updateVehicle = async (
  vehicleId: string,
  updatedData: Partial<Vehicle>
) => {
  try {
    const response = await apiClient.patch(`/vehicles/${vehicleId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update vehicle: ${error}`);
  }
};

export const deleteVehicle = async (vehicleId: number) => {
  try {
    await apiClient.delete(`/vehicles/${vehicleId}`);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete vehicle: ${error}`);
  }
};
