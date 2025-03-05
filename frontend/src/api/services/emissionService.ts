import API from "@/api/api";
import { EmissionData } from "@/types/types";

// ✅ Create Emission Data
export const addEmissionData = async (emissionData: EmissionData) => {
  try {
    const response = await API.post("/emissions", emissionData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add emission data: ${error}`);
  }
};

// ✅ Get All Emission Data (Paginated)
export const getAllEmissions = async (page: number, limit: number) => {
  try {
    const response = await API.get(`/emissions?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch emissions: ${error}`);
  }
};

// ✅ Get Emission Data by ID
export const getEmissionById = async (id: string) => {
  try {
    const response = await API.get(`/emissions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch emission data: ${error}`);
  }
};

// ✅ Update Emission Data by ID
export const updateEmission = async (
  id: string,
  updatedData: Partial<EmissionData>
) => {
  try {
    const response = await API.put(`/emissions/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update emission data: ${error}`);
  }
};

// ✅ Delete Emission Data by ID
export const deleteEmission = async (id: string) => {
  try {
    await API.delete(`/emissions/${id}`);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete emission data: ${error}`);
  }
};

// ✅ Get Emission Data for a Specific Vehicle (Paginated)
export const getVehicleEmissions = async (
  vehicleId: string,
  page: number,
  limit: number
) => {
  try {
    const response = await API.get(
      `/emissions/vehicle/${vehicleId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicle emissions: ${error}`);
  }
};
