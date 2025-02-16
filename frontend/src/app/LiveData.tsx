"use client";

import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

// ✅ Define TypeScript interfaces for received data
interface EmissionData {
  co2Percentage: number;
  coPercentage: number;
  o2Percentage: number;
  hcPPM: number;
}

interface FuelData {
  fuelLevel: number;
  fuelConsumption: number;
}

interface GPSData {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
}

const LiveData: React.FC = () => {
  // ✅ State management
  const [emissionData, setEmissionData] = useState<EmissionData | null>(null);
  const [fuelData, setFuelData] = useState<FuelData | null>(null);
  const [gpsData, setGpsData] = useState<GPSData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [serverMessage, setServerMessage] = useState<string>("");

  useEffect(() => {
    if (!socket) return;

    // ✅ Socket connection event handlers
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handleDataStatus = (data: {
      success: boolean;
      message: string;
      emissionData?: EmissionData;
      fuelData?: FuelData;
      gpsData?: GPSData;
    }) => {
      console.log("Live data received:", data);
      setServerMessage(data.message);

      if (data.success) {
        if (data.emissionData) setEmissionData(data.emissionData);
        if (data.fuelData) setFuelData(data.fuelData);
        if (data.gpsData) setGpsData(data.gpsData);
      }
    };

    // ✅ Attach event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("dataStatus", handleDataStatus);

    // ✅ Cleanup event listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("dataStatus", handleDataStatus);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Live Vehicle Data</h2>

      {/* ✅ Connection Status Indicator */}
      <p
        className={`text-lg font-semibold mb-4 ${
          isConnected ? "text-green-600" : "text-red-600"
        }`}
      >
        {isConnected ? "✅ Connected to server" : "❌ Disconnected from server"}
      </p>

      {/* ✅ Server Message */}
      {serverMessage && (
        <p className="text-blue-500 font-medium mb-4">{serverMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emission Data */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Emission Data</h3>
          {emissionData ? (
            <p className="text-gray-700">
              CO₂: {emissionData.co2Percentage}% | CO: {emissionData.coPercentage}% <br />
              O₂: {emissionData.o2Percentage}% | HC PPM: {emissionData.hcPPM}
            </p>
          ) : (
            <p className="text-gray-500">No emission data available.</p>
          )}
        </div>

        {/* Fuel Data */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Fuel Data</h3>
          {fuelData ? (
            <p className="text-gray-700">
              Fuel Level: {fuelData.fuelLevel}L <br />
              Consumption: {fuelData.fuelConsumption} L/km
            </p>
          ) : (
            <p className="text-gray-500">No fuel data available.</p>
          )}
        </div>

        {/* GPS Data */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">GPS Data</h3>
          {gpsData ? (
            <p className="text-gray-700">
              Lat: {gpsData.latitude} | Long: {gpsData.longitude} <br />
              Speed: {gpsData.speed} km/h | Accuracy: {gpsData.accuracy}m
            </p>
          ) : (
            <p className="text-gray-500">No GPS data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveData;
