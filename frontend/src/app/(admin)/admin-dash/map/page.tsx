"use client";

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript
} from "@react-google-maps/api";

const libraries: "places"[] = ["places"];
const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Default location

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
if (!API_KEY) {
  console.error("Missing Google Maps API Key!");
}

const CarTracking = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries
  });

  const [car, setCar] = useState<{
    id: number;
    plateNumber: string;
    location: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    route: { lat: number; lng: number }[];
    index: number;
  }>({
    id: 1,
    plateNumber: "XYZ-123",
    location: { lat: -1.6835, lng: 30.0878 },
    destination: { lat: -2.602, lng: 28.9084 }, // Example destination
    route: [],
    index: 0
  });
// const routeWaypoints = [
//   { lat: -1.6835, lng: 30.0878 }, // Gicumbi
//   { lat: -1.9447, lng: 30.0595 }, // Kigali (passing through)
//   { lat: -2.0997, lng: 29.7497 }, // Nyanza (passing through)
//   { lat: -2.3364, lng: 29.3739 }, // Nyamasheke (passing through)
//   { lat: -2.602, lng: 28.9084 } // Rusizi
// ];

  useEffect(() => {
    if (!isLoaded || !car.location || !car.destination) return;

    const fetchRoute = async () => {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: car.location,
        destination: car.destination,
        travelMode: google.maps.TravelMode.DRIVING
      });

      if (result.routes.length > 0) {
        const path = result.routes[0].overview_path.map((point) => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        setCar((prev) => ({ ...prev, route: path, index: 0 }));
      }
    };

    fetchRoute();
  }, [isLoaded, car.location, car.destination]); // ✅ Correct dependencies

  useEffect(() => {
    if (!car.route.length) return;

    const interval = setInterval(() => {
      setCar((prev) => {
        if (prev.index >= prev.route.length - 1) return prev;
        return {
          ...prev,
          location: prev.route[prev.index + 1],
          index: prev.index + 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [car.route]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={car.location || defaultCenter}>
      <Marker
        position={car.location}
        icon={{
          url: "/car-icon.png",
          scaledSize: new google.maps.Size(40, 40)
        }}
      />
      {car.route.length > 0 && (
        <Polyline path={car.route} options={{ strokeColor: "#ff2527" }} />
      )}
    </GoogleMap>
  );
};

export default CarTracking;
