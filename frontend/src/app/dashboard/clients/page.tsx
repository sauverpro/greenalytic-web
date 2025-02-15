"use client";
/* eslint-disable */
import React, { useState, useEffect } from "react";
import ReactSpeedometer from "react-d3-speedometer";
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

interface CarData {
  id: number;
  plate: string;
  currentData: {
    location: { lat: number; lng: number };
    speed: number;
    fuel: number;
    distance: number;
    emission: {
      co2: number;
      co: number;
      no: number;
      other: number;
    };
    status: "online" | "offline";
    lastOnline: Date;
  };
  history: {
    timestamp: Date;
    location: { lat: number; lng: number };
    speed: number;
    fuel: number;
    distance: number;
    emission: {
      co2: number;
      co: number;
      no: number;
      other: number;
    };
  }[];
  pathHistory: { lat: number; lng: number }[];
}

const initialCarsData: CarData[] = [
  {
    id: 1,
    plate: "RAA 123B",
    currentData: {
      location: { lat: -1.9403, lng: 30.0596 },
      speed: 45,
      fuel: 100,
      distance: 0,
      emission: { co2: 5.2, co: 1.8, no: 0.9, other: 0.5 },
      status: "online",
      lastOnline: new Date()
    },
    history: [],
    pathHistory: [{ lat: -1.9403, lng: 30.0596 }]
  },
  {
    id: 2,
    plate: "KBZ 789C",
    currentData: {
      location: { lat: -1.9453, lng: 30.0646 },
      speed: 38,
      fuel: 85,
      distance: 0,
      emission: { co2: 4.8, co: 1.6, no: 0.8, other: 0.4 },
      status: "online",
      lastOnline: new Date()
    },
    history: [],
    pathHistory: [{ lat: -1.9453, lng: 30.0646 }]
  }
];

const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      mode: "index" as const,
      intersect: false
    },
    legend: {
      position: "top" as const
    }
  },
  interaction: {
    mode: "index" as const,
    intersect: false
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)"
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  maintainAspectRatio: false
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Dashboard = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  const [cars, setCars] = useState<CarData[]>(initialCarsData);
  const [selectedCarId, setSelectedCarId] = useState(cars[0].id);

  const selectedCar = cars.find((car) => car.id === selectedCarId)!;

  useEffect(() => {
    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => {
          const prevLocation = car.currentData.location;
          const speedKmh = car.currentData.speed;
          const movementScale = (speedKmh / 3600) * 3;

          const newLocation = {
            lat: prevLocation.lat + (Math.random() - 0.5) * movementScale,
            lng: prevLocation.lng + (Math.random() - 0.5) * movementScale
          };

          const distanceMoved = calculateDistance(
            prevLocation.lat,
            prevLocation.lng,
            newLocation.lat,
            newLocation.lng
          );

          const fuelConsumption = distanceMoved * 0.1;

          const newHistoryEntry = {
            timestamp: new Date(),
            location: { ...newLocation },
            speed: car.currentData.speed,
            fuel: car.currentData.fuel,
            distance: car.currentData.distance + distanceMoved,
            emission: { ...car.currentData.emission }
          };

          return {
            ...car,
            currentData: {
              ...car.currentData,
              location: newLocation,
              speed: Math.max(
                0,
                Math.min(200, car.currentData.speed + (Math.random() - 0.5) * 5)
              ),
              fuel: Math.max(0, car.currentData.fuel - fuelConsumption),
              distance: car.currentData.distance + distanceMoved,
              emission: {
                co2: car.currentData.emission.co2 + (Math.random() - 0.5) * 0.1,
                co: car.currentData.emission.co + (Math.random() - 0.5) * 0.05,
                no: car.currentData.emission.no + (Math.random() - 0.5) * 0.05,
                other:
                  car.currentData.emission.other + (Math.random() - 0.5) * 0.02
              }
            },
            history: [...car.history, newHistoryEntry].slice(-50),
            pathHistory: [...car.pathHistory, newLocation].slice(-100)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const cardData = [
    {
      title: "Fuel Level",
      value: `${selectedCar.currentData.fuel.toFixed(1)}L`,
      icon: "⛽",
      color: "bg-blue-100"
    },
    {
      title: "Distance Traveled",
      value: `${selectedCar.currentData.distance.toFixed(2)} km`,
      icon: "🛣️",
      color: "bg-green-100"
    },
    {
      title: "Status",
      value: selectedCar.currentData.status,
      icon: "⏱️",
      color: "bg-purple-100"
    }
  ];

  const speedData = {
    labels: selectedCar.history.map((h) => h.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: "Speed (km/h)",
        data: selectedCar.history.map((h) => h.speed),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const fuelData = {
    labels: selectedCar.history.map((h) => h.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: "Fuel Level (L)",
        data: selectedCar.history.map((h) => h.fuel),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const emissionsData = {
    labels: selectedCar.history.map((h) => h.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: "CO₂ (g/km)",
        data: selectedCar.history.map((h) => h.emission.co2),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4
      },
      {
        label: "CO (g/km)",
        data: selectedCar.history.map((h) => h.emission.co),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.4
      },
      {
        label: "NO (g/km)",
        data: selectedCar.history.map((h) => h.emission.no),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Header Section */}
      <div className="bg-white shadow-lg px-6 py-4 border-b border-gray-200">
        <div className="">
          {/* Car Selector */}
          <div className="mb-4 flex items-center">
            <label className="font-bold text-lg text-gray-700">
              🚗 Select Vehicle:
            </label>
            <select
              className="ml-2 p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(Number(e.target.value))}>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.plate}
                </option>
              ))}
            </select>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
            {cardData.map((data, index) => (
              <div
                key={index}
                className={`${data.color} flex flex-col justify-between p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg h-auto min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] mx-auto`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-lg font-semibold text-gray-600 truncate">
                      {data.title}
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {data.value}
                    </p>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl">
                    {data.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-[400px] w-full">
              {isLoaded ? (
                <GoogleMap
                  center={selectedCar.currentData.location}
                  zoom={14}
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  options={{
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                      }
                    ]
                  }}>
                  <Marker position={selectedCar.currentData.location} />
                  <Polyline
                    path={selectedCar.pathHistory}
                    options={{
                      strokeColor: "#4A90E2",
                      strokeOpacity: 0.8,
                      strokeWeight: 3
                    }}
                  />
                </GoogleMap>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Loading map...</p>
                </div>
              )}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Speed Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                🔥 Live Speed
              </h2>
              <div className="min-h-[400px] flex items-center justify-center">
                <ReactSpeedometer
                  maxValue={200}
                  value={selectedCar.currentData.speed}
                  needleColor="red"
                  startColor="green"
                  endColor="red"
                  segments={5}
                  currentValueText={`${selectedCar.currentData.speed.toFixed(
                    1
                  )} km/h`}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📈 Speed History
              </h2>
              <div className="min-h-[400px]">
                <Line data={speedData} options={chartOptions} />
              </div>
            </div>

            {/* Emissions and Fuel Charts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                🌍 Emission Levels
              </h2>
              <div className="min-h-[400px]">
                <Line data={emissionsData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                ⛽ Fuel Level
              </h2>
              <div className="min-h-[400px]">
                <Line data={fuelData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
