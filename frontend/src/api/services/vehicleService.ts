import API from "@/api/api";
import { Vehicle, EmissionData } from "@/types/types";

// ✅ Add Vehicle to User
export const addVehicleToUser = async (
  userId: string,
  vehicleData: Vehicle
) => {
  try {
    const response = await API.post(
      `/vehicles/addvehicletouser/${userId}`,
      vehicleData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add vehicle to user: ${error}`);
  }
};

// ✅ Get Vehicles for a Specific User
export const getUserVehicles = async (userId: string) => {
  try {
    const response = await API.get(`/vehicles/user/${userId}/vehicles`);
    return response.data.vehicles;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
};

// ✅ Get a Single Vehicle by ID
export const getVehicleById = async (vehicleId: string) => {
  try {
    const response = await API.get(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicle: ${error}`);
  }
};

// ✅ Update a Vehicle
export const updateVehicle = async (
  vehicleId: string,
  updatedData: Partial<Vehicle>
) => {
  try {
    const response = await API.put(`/vehicles/${vehicleId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update vehicle: ${error}`);
  }
};

// ✅ Delete a Vehicle
export const deleteVehicle = async (vehicleId: string) => {
  try {
    await API.delete(`/vehicles/${vehicleId}`);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete vehicle: ${error}`);
  }
};
