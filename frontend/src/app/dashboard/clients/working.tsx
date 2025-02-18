"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io("http://localhost:4000", {
  reconnection: true, // Automatically attempt reconnection
  reconnectionAttempts: Infinity, // Unlimited reconnection attempts
  reconnectionDelay: 1000, // Wait 1 second before retrying
  reconnectionDelayMax: 5000, // Max wait time before retrying
  timeout: 20000 // Timeout for initial connection
});

const VehicleDataPage = ({ vehicleId=1 }: { vehicleId: number }) => {
  const [emissionData, setEmissionData] = useState<any>([]);
  const [fuelData, setFuelData] = useState<any>([]);
  const [gpsData, setGpsData] = useState<any>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

  useEffect(() => {
    // ✅ Socket connection handling
    socket.on("connect", () => {
      setConnectionStatus("Connected");
      console.log("Socket connected:", socket.id);

      // Start tracking vehicle once connected
      socket.emit("trackVehicle", vehicleId);
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected. Reconnecting...");
      console.log("Socket disconnected");
    });

    socket.on("reconnect", (attempt) => {
      setConnectionStatus(`Reconnected (Attempt: ${attempt})`);
      console.log(`Reconnected (Attempt: ${attempt})`);
      // Re-start tracking after reconnect
      socket.emit("trackVehicle", vehicleId);
    });

    socket.on("dataStatus", (data) => {
      console.log("Data status:", data);
      if (data.success) {
        if (data.emissionData && data.emissionData.vehicleId === vehicleId) {
          setEmissionData((prevData: any) => [...prevData, data.emissionData]);
        }
        if (data.fuelData && data.fuelData.vehicleId === vehicleId) {
          setFuelData((prevData: any) => [...prevData, data.fuelData]);
        }
        if (data.gpsData && data.gpsData.vehicleId === vehicleId) {
          setGpsData((prevData: any) => [...prevData, data.gpsData]);
        }
      }
    });

    // Cleanup when component is unmounted
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("dataStatus");
    };
  }, [vehicleId]);

  // Chart data for emission
  const emissionChartData = {
    labels: emissionData.map((item: any) => item.timestamp),
    datasets: [
      {
        label: "CO2 Percentage",
        data: emissionData.map((item: any) => item.co2Percentage),
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1
      },
      {
        label: "CO Percentage",
        data: emissionData.map((item: any) => item.coPercentage),
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1
      }
    ]
  };

  // Chart data for fuel
  const fuelChartData = {
    labels: fuelData.map((item: any) => item.timestamp),
    datasets: [
      {
        label: "Fuel Level",
        data: fuelData.map((item: any) => item.fuelLevel),
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1
      },
      {
        label: "Fuel Consumption",
        data: fuelData.map((item: any) => item.fuelConsumption),
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.1
      }
    ]
  };

  // Chart data for GPS
  const gpsChartData = {
    labels: gpsData.map((item: any) => item.timestamp),
    datasets: [
      {
        label: "Speed (km/h)",
        data: gpsData.map((item: any) => item.speed),
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <h1>Vehicle Data - Vehicle ID: {vehicleId}</h1>
      <h2>Status: {connectionStatus}</h2>

      <h2>Emission Data</h2>
      <Line data={emissionChartData} />

      <h2>Fuel Data</h2>
      <Line data={fuelChartData} />

      <h2>GPS Data</h2>
      <Line data={gpsChartData} />
    </div>
  );
};

export default VehicleDataPage;
