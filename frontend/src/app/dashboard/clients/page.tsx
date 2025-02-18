"use client";
/* eslint-disable */
import React, { useState, useEffect } from "react";
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
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
  Libraries
} from "@react-google-maps/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const libraries: Libraries = ["places"];
const socket = io("http://localhost:4000"); // Replace with your backend URL

const mapContainerStyle = {
  width: "100%",
  height: "600px"
};

const defaultCenter = { lat: 0, lng: 0 }; // Default center if no GPS data
const MAX_DATA_POINTS = 50000;

export default function RealTimeChart() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  const [gpsData, setGpsData] = useState<
    { timestamp: number; speed: number; lat: number; lng: number }[]
  >([]);
  const [fuelData, setFuelData] = useState<
    { timestamp: number; fuelLevel: number }[]
  >([]);
  const [emissionData, setEmissionData] = useState<
    {
      timestamp: number;
      co2Percentage: number;
      coPercentage: number;
      o2Percentage: number;
      hcPPM: number;
    }[]
  >([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const handleDataStatus = (data: any) => {
      if (
        data.type === "gps" &&
        data.gpsData.latitude &&
        data.gpsData.longitude
      ) {
        const newGpsEntry = {
          timestamp: Date.now(),
          speed: data.gpsData.speed,
          lat: data.gpsData.latitude,
          lng: data.gpsData.longitude
        };

        // Limit the number of data points
        setGpsData((prev) => {
          const updatedData = [...prev, newGpsEntry];
          if (updatedData.length > MAX_DATA_POINTS) {
            updatedData.shift(); // Remove the oldest data point
          }
          return updatedData;
        });

        setCurrentLocation({ lat: newGpsEntry.lat, lng: newGpsEntry.lng });
      }

      // Fuel data
      if (data.type === "fuel" && data.fuelData) {
        const newFuelEntry = {
          timestamp: Date.now(),
          fuelLevel: data.fuelData.fuelLevel
        };

        setFuelData((prev) => {
          const updatedFuelData = [...prev, newFuelEntry];
          if (updatedFuelData.length > MAX_DATA_POINTS) {
            updatedFuelData.shift();
          }
          return updatedFuelData;
        });
      }

      // Emission data
      if (data.type === "emission" && data.emissionData) {
        const newEmissionEntry = {
          timestamp: Date.now(),
          co2Percentage: data.emissionData.co2Percentage,
          coPercentage: data.emissionData.coPercentage,
          o2Percentage: data.emissionData.o2Percentage,
          hcPPM: data.emissionData.hcPPM
        };

        setEmissionData((prev) => {
          const updatedEmissionData = [...prev, newEmissionEntry];
          if (updatedEmissionData.length > MAX_DATA_POINTS) {
            updatedEmissionData.shift();
          }
          return updatedEmissionData;
        });
      }
    };

    socket.on("dataStatus", handleDataStatus);

    return () => {
      socket.off("dataStatus", handleDataStatus);
    };
  }, []);

  // Chart.js Data for Speed with Smooth Lines
  const speedChartData = {
    labels: gpsData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Vehicle Speed (km/h)",
        data: gpsData.map((d) => d.speed),
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        tension: 0.4 // Smooth line curve
      }
    ]
  };

  // Chart.js Data for Fuel Level with Smooth Lines
  const fuelChartData = {
    labels: fuelData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Fuel Level (%)",
        data: fuelData.map((d) => d.fuelLevel),
        backgroundColor: "green",
        borderColor: "green",
        borderWidth: 2,
        fill: true,
        tension: 0.4 // Smooth line curve
      }
    ]
  };

  // Chart.js Data for Emission Levels with Smooth Lines
  const emissionChartData = {
    labels: emissionData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "CO2 Percentage",
        data: emissionData.map((d) => d.co2Percentage),
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        tension: 0.4 // Smooth line curve
      },
      {
        label: "CO Percentage",
        data: emissionData.map((d) => d.coPercentage),
        backgroundColor: "orange",
        borderColor: "orange",
        borderWidth: 2,
        fill: false,
        tension: 0.4 // Smooth line curve
      },
      {
        label: "O2 Percentage",
        data: emissionData.map((d) => d.o2Percentage),
        backgroundColor: "green",
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        tension: 0.4 // Smooth line curve
      },
      {
        label: "HC PPM",
        data: emissionData.map((d) => d.hcPPM),
        backgroundColor: "purple",
        borderColor: "purple",
        borderWidth: 2,
        fill: false,
        tension: 0.4 // Smooth line curve
      }
    ]
  };

  return (
    <div>
      <h2>Real-Time Vehicle Tracking</h2>

      {/* Speed Chart */}
      <Line data={speedChartData} />

      {/* Fuel Level Chart */}
      <Line data={fuelChartData} />

      {/* Emission Level Chart */}
      <Line data={emissionChartData} />

      {/* Google Map Displaying Live GPS Location */}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={currentLocation || defaultCenter}>
          {/* Marker for current location */}
          {currentLocation && <Marker position={currentLocation} />}

          {/* Polyline showing the path of the car */}
          <Polyline
            path={gpsData.map((d) => ({ lat: d.lat, lng: d.lng }))}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 2
            }}
          />
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}
