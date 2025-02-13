"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";

// Fix for missing Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Interface for car position history
interface CarPosition {
  lat: number;
  lng: number;
  timestamp: number;
}

interface Car {
  id: number;
  owner: string;
  position: [number, number];
  history: CarPosition[];
  totalDistance: number;
}

// Initial cars with history
const initialCars: Car[] = [
  {
    id: 1,
    owner: "User A",
    position: [-1.9403, 30.0596],
    history: [],
    totalDistance: 0
  },
  {
    id: 2,
    owner: "User A",
    position: [-1.945, 30.061],
    history: [],
    totalDistance: 0
  },
  {
    id: 3,
    owner: "User B",
    position: [-1.95, 30.065],
    history: [],
    totalDistance: 0
  },
  {
    id: 4,
    owner: "User C",
    position: [-1.93, 30.057],
    history: [],
    totalDistance: 0
  }
];

// Calculate distance between two points in kilometers
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth's radius in km
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

const MapComponent = () => {
  const [cars, setCars] = useState<Car[]>(initialCars);

  useEffect(() => {
    // Simulate car movement
    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => {
          const newLat = car.position[0] + (Math.random() - 0.5) * 0.001;
          const newLng = car.position[1] + (Math.random() - 0.5) * 0.001;

          // Calculate distance from previous position
          const distance =
            car.history.length > 0
              ? calculateDistance(
                  car.position[0],
                  car.position[1],
                  newLat,
                  newLng
                )
              : 0;

          // Update history and total distance
          return {
            ...car,
            position: [newLat, newLng],
            history: [
              ...car.history,
              { lat: newLat, lng: newLng, timestamp: Date.now() }
            ].slice(-5000), // Keep last 5000 positions
            totalDistance: car.totalDistance + distance
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Different colors for each car's path
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FF00FF"];

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        center={[-1.9403, 30.0596]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cars.map((car, index) => (
          <React.Fragment key={car.id}>
            <Marker position={car.position as [number, number]}>
              <Popup>
                🚗 Car ID: {car.id} <br />
                Owner: {car.owner} <br />
                Lat: {car.position[0].toFixed(5)}, Lng:{" "}
                {car.position[1].toFixed(5)} <br />
                Total Distance: {car.totalDistance.toFixed(3)} km
              </Popup>
            </Marker>
            {car.history.length > 1 && (
              <Polyline
                positions={car.history.map((pos) => [pos.lat, pos.lng])}
                color={colors[index % colors.length]}
                weight={3}
                opacity={0.7}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

// Dynamically load the map component with no SSR
const MapWithNoSSR = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false
});

const Page = () => {
  return (
    <div>
      <h1>Live Car Tracking</h1>
      <MapWithNoSSR />
    </div>
  );
};

export default Page;
