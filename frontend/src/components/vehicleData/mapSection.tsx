"use client";

import React from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";

interface Vehicle {
  position: {
    lat: number;
    lng: number;
  };
  plateNumber: string;
  vehicleId: number;
  speed: number;
  isActive: boolean;
  lastSeen: string;
}

interface MapSectionProps {
  currentLocation: { lat: number; lng: number };
  pathHistory: { lat: number; lng: number }[];
  vehicles?: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

declare global {
  interface Window {
    google: any;
  }
}

const MapSection: React.FC<MapSectionProps> = ({
  currentLocation,
  pathHistory,
  vehicles = [],
  isLoading,
  error,
}) => {
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(
    null
  );

  // Calculate map bounds to fit all vehicles
  const getBounds = () => {
    if (vehicles && vehicles.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      vehicles.forEach((vehicle) => {
        bounds.extend(vehicle.position);
      });
      return bounds;
    }
    return null;
  };

  const onMapLoad = React.useCallback(
    (map: google.maps.Map) => {
      const bounds = getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
    },
    [vehicles]
  );

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-bold p-4 border-b border-gray-200">
          🗺️ Vehicle Location
        </h2>
        <div className="h-[400px] w-full flex items-center justify-center bg-red-50">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold p-4 border-b border-gray-200">
        🗺️ Vehicle Location
      </h2>
      <div className="h-[400px] w-full">
        {!isLoading ? (
          <GoogleMap
            center={currentLocation}
            zoom={14}
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={{
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
            onLoad={onMapLoad}
          >
            {/* Show all vehicles on the map */}
            {vehicles.map((vehicle, index) => (
              <Marker
                key={`vehicle-${vehicle.vehicleId}-${index}`}
                position={vehicle.position}
                title={vehicle.plateNumber}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: vehicle.isActive ? "#10b981" : "#6b7280",
                  fillOpacity: 0.8,
                  strokeWeight: 1,
                  strokeColor: "#ffffff",
                }}
                onClick={() => setSelectedVehicle(vehicle)}
              />
            ))}

            {/* Show info window for selected vehicle */}
            {selectedVehicle && (
              <InfoWindow
                position={selectedVehicle.position}
                onCloseClick={() => setSelectedVehicle(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold mb-1">
                    {selectedVehicle.plateNumber}
                  </h3>
                  <p className="text-sm">
                    Vehicle ID: {selectedVehicle.vehicleId}
                  </p>
                  <p className="text-sm">
                    Speed: {selectedVehicle.speed.toFixed(1)} km/h
                  </p>
                  <p className="text-sm">
                    Status: {selectedVehicle.isActive ? "Active" : "Inactive"}
                  </p>
                  <p className="text-sm">
                    Last seen:{" "}
                    {new Date(selectedVehicle.lastSeen).toLocaleString()}
                  </p>
                </div>
              </InfoWindow>
            )}

            {/* Show current location marker if no vehicles */}
            {vehicles.length === 0 && <Marker position={currentLocation} />}

            {/* Show path history */}
            {pathHistory.length > 0 && (
              <Polyline
                path={pathHistory}
                options={{
                  strokeColor: "#4A90E2",
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <p className="text-sms">Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSection;
