import API from "@/api/api";
import useAxiosClient from "@/hooks/axiosClient";
import { TrackingDevice } from "@/types/types";
const client = useAxiosClient();

export const addDeviceToVehicle = async (
  vehicleId: string,
  deviceData: TrackingDevice
) => {
  try {
    const response = await client.post(
      `/trackingDevices/add/${vehicleId}`,
      deviceData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add vehicle to user: ${error}`);
  }
};


export const getDevicesForVehicle = async (vehicleId: string) => {
  try { 
    const response = await client.get(
      `/trackingDevices/vehicle/${vehicleId}/devices`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
}

//get sll devices
export const getAllDevices = async () => {
  try {
    const response = await client.get(`/trackingDevices/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles for user: ${error}`);
  }
}

