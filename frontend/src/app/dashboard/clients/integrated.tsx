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

const defaultCenter = { lat: -1.94995, lng: 30.05885 }; // Coordinates for Kigali, Rwanda

const MAX_DATA_POINTS = 50000;

export default function RealTimeChart() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [gpsData, setGpsData] = useState<
    {
      vehicleId: number;
      timestamp: number;
      speed: number;
      lat: number;
      lng: number;
    }[]
  >([]);
  const [fuelData, setFuelData] = useState<
    {
      vehicleId: number;
      timestamp: number;
      fuelLevel: number;
    }[]
  >([]);
  const [emissionData, setEmissionData] = useState<
    {
      vehicleId: number;
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
  } | null>({ lat: -1.9441, lng: 30.0619 });

  useEffect(() => {
    const handleDataStatus = (data: any) => {
      if (
        data.type === "gps" &&
        data.gpsData.latitude &&
        data.gpsData.longitude
      ) {
        const newGpsEntry = {
          vehicleId: data.gpsData.vehicleId,
          timestamp: Date.now(),
          speed: data.gpsData.speed,
          lat: data.gpsData.latitude,
          lng: data.gpsData.longitude
        };

        setGpsData((prev) => {
          const updatedData = [...prev, newGpsEntry];
          if (updatedData.length > MAX_DATA_POINTS) {
            updatedData.shift();
          }
          return updatedData;
        });

        if (data.gpsData.vehicleId === selectedCarId) {
          setCurrentLocation({ lat: newGpsEntry.lat, lng: newGpsEntry.lng });
        }
      }

      if (data.type === "fuel" && data.fuelData) {
        const newFuelEntry = {
          vehicleId: data.fuelData.vehicleId,
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

      if (data.type === "emission" && data.emissionData) {
        const newEmissionEntry = {
          vehicleId: data.emissionData.vehicleId,
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
  }, [selectedCarId]);

  const filteredGpsData = gpsData.filter((d) => d.vehicleId === selectedCarId);
  const filteredFuelData = fuelData.filter(
    (d) => d.vehicleId === selectedCarId
  );
  const filteredEmissionData = emissionData.filter(
    (d) => d.vehicleId === selectedCarId
  );

  // Smooth polyline using Bezier curve
  const bezierCurve = (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    t: number
  ) => {
    return {
      lat: start.lat + t * (end.lat - start.lat),
      lng: start.lng + t * (end.lng - start.lng)
    };
  };

  const createSmoothPath = (
    points: { lat: number; lng: number }[]
  ): { lat: number; lng: number }[] => {
    const smoothPath: { lat: number; lng: number }[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      for (let t = 0; t <= 1; t += 0.1) {
        smoothPath.push(bezierCurve(start, end, t));
      }
    }
    return smoothPath;
  };

  const smoothPath = createSmoothPath(filteredGpsData);

  return (
    <div>
      <h2>Real-Time Vehicle Tracking</h2>

      {/* Car Selection Dropdown */}
      <select
        onChange={(e) => setSelectedCarId(Number(e.target.value))}
        value={selectedCarId || ""}>
        <option value="">Select a Car</option>
        {[1, 2, 3].map((id) => (
          <option key={id} value={id}>
            Car {id}
          </option>
        ))}
      </select>

      {/* Speed Chart */}
      <Line
        data={{
          labels: filteredGpsData.map((d) =>
            new Date(d.timestamp).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "Vehicle Speed (km/h)",
              data: filteredGpsData.map((d) => d.speed),
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
              tension: 0.4 // Smooth line curve
            }
          ]
        }}
      />

      {/* Fuel Level Chart */}
      <Line
        data={{
          labels: filteredFuelData.map((d) =>
            new Date(d.timestamp).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "Fuel Level (%)",
              data: filteredFuelData.map((d) => d.fuelLevel),
              backgroundColor: "green",
              borderColor: "green",
              borderWidth: 2,
              fill: true,
              tension: 0.4 // Smooth line curve
            }
          ]
        }}
      />

      {/* Emission Level Chart */}
      <Line
        data={{
          labels: filteredEmissionData.map((d) =>
            new Date(d.timestamp).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "CO2 Percentage",
              data: filteredEmissionData.map((d) => d.co2Percentage),
              backgroundColor: "red",
              borderColor: "red",
              borderWidth: 2,
              fill: false,
              tension: 0.4 // Smooth line curve
            },
            {
              label: "CO Percentage",
              data: filteredEmissionData.map((d) => d.coPercentage),
              backgroundColor: "orange",
              borderColor: "orange",
              borderWidth: 2,
              fill: false,
              tension: 0.4 // Smooth line curve
            },
            {
              label: "O2 Percentage",
              data: filteredEmissionData.map((d) => d.o2Percentage),
              backgroundColor: "green",
              borderColor: "green",
              borderWidth: 2,
              fill: false,
              tension: 0.4 // Smooth line curve
            },
            {
              label: "HC PPM",
              data: filteredEmissionData.map((d) => d.hcPPM),
              backgroundColor: "purple",
              borderColor: "purple",
              borderWidth: 2,
              fill: false,
              tension: 0.4 // Smooth line curve
            }
          ]
        }}
      />

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
            path={smoothPath}
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
