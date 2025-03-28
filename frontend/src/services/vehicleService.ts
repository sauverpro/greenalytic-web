import useAxiosClient from "@/hooks/axiosClient";
import { Vehicle, EmissionData } from "@/types/types";

const client = useAxiosClient();

export const addVehicleToUser = async (
  userId: string,
  vehicleData: Vehicle
) => {
  try {
    const response = await client.post(`/vehicles/add/${userId}`, vehicleData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add vehicle to user: ${error}`);
  }
};

export const getVehiclesForUser = async (userId: string) => {
  try {
    const response = await client.get(`/vehicles/user/${userId}/vehicles`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
};

export const getUserVehicles = async () => {
  try {
    const response = await client.get("/vehicles");
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user vehicles: ${error}`);
  }
};

export const getAllVehicles = async () => {
  try {
    const response = await client.get(`/vehicles/all`);
    return response.data.vehicles;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
};

export const getVehicleById = async (vehicleId: string) => {
  try {
    const response = await client.get(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicle: ${error}`);
  }
};

// export const updateVehicle = async (
//   vehicleId: string,
//   updatedData: Partial<Vehicle>
// ) => {
//   try {
//     const response = await client.patch(`/vehicles/${vehicleId}`, updatedData);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update vehicle: ${error}`);
//   }
// };

export const deleteVehicle = async (vehicleId: string) => {
  try {
    await client.delete(`/vehicles/${vehicleId}`);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete vehicle: ${error}`);
  }
};
