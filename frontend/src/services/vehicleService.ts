import API from "@/api/api";
import { Vehicle } from "@/types/types";

// Add vehicle to user
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
