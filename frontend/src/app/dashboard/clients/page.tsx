"use client";
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
  
  Title,
  Tooltip,
  Legend
);

const libraries: Libraries = ["places"];

// Improved car data structure with historical and live data separation
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
const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      mode: "index" as const, // Show all values at the hovered X-axis position
      intersect: false // Allow hovering anywhere on the chart
    }
  },
  interaction: {
    mode: "index" as const, // Ensures all gas values appear when hovering
    intersect: false
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};


// Initialize multiple cars
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

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Dashboard = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  const [cars, setCars] = useState<CarData[]>(initialCarsData);
  const [selectedCarId, setSelectedCarId] = useState(cars[0].id);

  // Get selected car data
  const selectedCar = cars.find(car => car.id === selectedCarId)!;

  // Simulate real-time updates with more realistic behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setCars(prevCars => 
        prevCars.map(car => {
          const prevLocation = car.currentData.location;
          const speedKmh = car.currentData.speed;
          
          // Calculate new position based on current speed
          const movementScale = (speedKmh / 3600) * 3; // Convert km/h to degrees per second
          const newLocation = {
            lat: prevLocation.lat + (Math.random() - 0.5) * movementScale,
            lng: prevLocation.lng + (Math.random() - 0.5) * movementScale
          };

          // Calculate distance moved
          const distanceMoved = calculateDistance(
            prevLocation.lat,
            prevLocation.lng,
            newLocation.lat,
            newLocation.lng
          );

          // Calculate fuel consumption (roughly 0.1L per km)
          const fuelConsumption = distanceMoved * 0.1;

          // Create new history entry
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
              speed: Math.max(0, Math.min(200, car.currentData.speed + (Math.random() - 0.5) * 5)),
              fuel: Math.max(0, car.currentData.fuel - fuelConsumption),
              distance: car.currentData.distance + distanceMoved,
              emission: {
                co2: car.currentData.emission.co2 + (Math.random() - 0.5) * 0.1,
                co: car.currentData.emission.co + (Math.random() - 0.5) * 0.05,
                no: car.currentData.emission.no + (Math.random() - 0.5) * 0.05,
                other: car.currentData.emission.other + (Math.random() - 0.5) * 0.02
              }
            },
            history: [...car.history, newHistoryEntry].slice(-50), // Keep last 50 records
            pathHistory: [...car.pathHistory, newLocation].slice(-100) // Keep last 100 positions
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Prepare chart data from history
  const speedData = {
    labels: selectedCar.history.map(h => h.timestamp.toLocaleTimeString()),
    datasets: [{
      label: "Speed (km/h)",
      data: selectedCar.history.map(h => h.speed),
      borderColor: "red",
      backgroundColor: "rgba(255, 0, 0, 0.3)",
      fill: true
    }]
  };

//   const emissionsData = {
//     labels: selectedCar.history.map(h => h.timestamp.toLocaleTimeString()),
//     datasets: [
//       {
//         label: "CO₂ (g/km)",
//         data: selectedCar.history.map(h => h.emission.co2),
//         borderColor: "green",
//         backgroundColor: "rgba(0, 255, 0, 0.3)",
//         fill: true
//       },
//       {
//         label: "CO (g/km)",
//         data: selectedCar.history.map(h => h.emission.co),
//         borderColor: "blue",
//         backgroundColor: "rgba(0, 0, 255, 0.3)",
//         fill: true
//       },
//       {
//         label: "NO (g/km)",
//         data: selectedCar.history.map(h => h.emission.no),
//         borderColor: "orange",
//         backgroundColor: "rgba(255, 165, 0, 0.3)",
//         fill: true
//       }
//     ]
//   };
const emissionsData = {
  labels: selectedCar.history.map((h) => h.timestamp.toLocaleTimeString()),
  datasets: [
    {
      label: "CO₂ (g/km)",
      data: selectedCar.history.map(
        (h, i) =>
          h.emission.co2 + Math.sin(i * 0.3) * 1.5 + (Math.random() - 0.5) * 0.5
      ),
      borderColor: "green",
      backgroundColor: "rgba(0, 255, 0, 0.3)",
      fill: true,
      tension: 0.4 // Makes the line curve smoothly like a wave
    },
    {
      label: "CO (g/km)",
      data: selectedCar.history.map(
        (h, i) =>
          h.emission.co + Math.sin(i * 0.4) * 0.8 + (Math.random() - 0.5) * 0.3
      ),
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.3)",
      fill: true,
      tension: 0.4 // Curved effect
    },
    {
      label: "NO (g/km)",
      data: selectedCar.history.map(
        (h, i) =>
          h.emission.no + Math.sin(i * 0.2) * 1.2 + (Math.random() - 0.5) * 0.4
      ),
      borderColor: "orange",
      backgroundColor: "rgba(255, 165, 0, 0.3)",
      fill: true,
      tension: 0.4 // Smooth wave effect
    }
  ]
};

  return (
    <div className="p-6">
      {/* Car Selector */}
      <div className="mb-4">
        <label className="font-bold text-lg">🚗 Select Car:</label>
        <select
          className="ml-2 p-2 border rounded"
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
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">⛽ Fuel Level</h3>
          <p className="text-2xl">{selectedCar.currentData.fuel.toFixed(1)}L</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">🛣️ Distance Traveled</h3>
          <p className="text-2xl">
            {selectedCar.currentData.distance.toFixed(2)}km
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">⏱️ Status</h3>
          <p className="text-2xl">{selectedCar.currentData.status}</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-[300px] w-full mb-4">
        {isLoaded ? (
          <GoogleMap
            center={selectedCar.currentData.location}
            zoom={14}
            mapContainerStyle={{ height: "100%", width: "100%" }}>
            <Marker position={selectedCar.currentData.location} />
            <Polyline
              path={selectedCar.pathHistory}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {/* Speedometer & Speed Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">🔥 Live Speed</h2>
          <ReactSpeedometer
            maxValue={200}
            value={selectedCar.currentData.speed}
            needleColor="red"
            startColor="green"
            endColor="red"
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">📈 Speed History</h2>
          <Line data={speedData} />
        </div>
      </div>

      {/* Emissions Chart */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl font-bold mb-2">🌍 Emission Levels</h2>
        {
          /* <Line data={emissionsData}  />
           */
          <Line data={emissionsData} options={chartOptions} />
        }
      </div>
    </div>
  );
};

export default Dashboard;