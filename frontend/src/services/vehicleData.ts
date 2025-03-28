import useAxiosClient from "@/hooks/axiosClient";
// import { EmissionData, FuelData, GPSData } from "@/types/types";
 const client =  useAxiosClient()

interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export const getEmissionsData = async (
  vehicleId: string | number,
  params: DateRangeParams
) => {
  try {
    const response = await client.get(`/vehicles/${vehicleId}/emissions/range`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch emissions data: ${error}`);
  }
};

export const getFuelData = async (
  vehicleId: string | number,
  params: DateRangeParams
)=> {
  try {
    const response = await client.get(`/vehicles/${vehicleId}/fuels/range`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch fuel data: ${error}`);
  }
};

export const getGPSData = async (
  vehicleId: string | number,
  params: DateRangeParams
)=> {
  try {
    const response = await client.get(`/vehicles/${vehicleId}/gps/range`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch GPS data: ${error}`);
  }
};
