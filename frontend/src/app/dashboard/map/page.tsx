"use client";

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript
} from "@react-google-maps/api";

const libraries: any = ["places"];
const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Default location (change as needed)
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Load from environment variables

const CarTracking = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY!,
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
    location: { lat: 12.9716, lng: 77.5946 },
    destination: { lat: 12.9352, lng: 77.6245 }, // Example destination
    route: [],
    index: 0
  });

  useEffect(() => {
    if (!isLoaded) return;

    // Fetch real road route from Google Directions API
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
  }, [isLoaded]);

  // Simulate car moving along the route
  useEffect(() => {
    if (car.route.length === 0) return;

    const interval = setInterval(() => {
      setCar((prev) => {
        if (prev.index >= prev.route.length - 1) return prev;
        return {
          ...prev,
          location: prev.route[prev.index + 1],
          index: prev.index + 1
        };
      });
    }, 1000); // Move every second

    return () => clearInterval(interval);
  }, [car.route]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={car.location}>
      <Marker position={car.location} label="🚗" />
      {car.route.length > 0 && (
        <Polyline path={car.route} options={{ strokeColor: "#ff2527" }} />
      )}
    </GoogleMap>
  );
};

export default CarTracking;
