"use client";

import React from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useJsApiLoader,
  OverlayView,
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
  totalVehicles?: number;
  vehiclesWithGps?: number;
}

declare global {
  interface Window {
    google: any;
  }
}

// You'll need to add your Google Maps API key here
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const MapSection: React.FC<MapSectionProps> = ({
  currentLocation,
  pathHistory,
  vehicles = [],
  isLoading,
  error,
  totalVehicles,
  vehiclesWithGps,
}) => {
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(
    null
  );
  const [showLabels, setShowLabels] = React.useState<boolean>(true);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  // Calculate map bounds to fit all vehicles
  const getBounds = () => {
    if (window.google && vehicles && vehicles.length > 0) {
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
      <div className="h-[400px] w-full flex items-center justify-center bg-red-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
        <p className="text-sm">Loading map...</p>
      </div>
    );
  }

  const StatusOverlay = () => (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md z-10">
      <p className="font-medium text-sm">Vehicle Status</p>
      <div className="mt-1 space-y-1">
        <p className="text-xs">Total Vehicles: {totalVehicles}</p>
        <p className="text-xs">With GPS Data: {vehiclesWithGps}</p>
      </div>
    </div>
  );

  const ControlPanel = () => (
    <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-10">
      <label className="flex items-center space-x-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={() => setShowLabels(!showLabels)}
          className="h-4 w-4"
        />
        <span>Show Labels</span>
      </label>
    </div>
  );

  return (
    <div className="h-[400px] w-full relative">
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
          <React.Fragment key={`vehicle-${vehicle.vehicleId}-${index}`}>
            <Marker
              position={vehicle.position}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: vehicle.isActive ? "#10b981" : "#ef4444",
                fillOpacity: 0.8,
                strokeWeight: 1,
                strokeColor: "#ffffff",
              }}
              onClick={() => setSelectedVehicle(vehicle)}
            />

            {/* Custom label overlay */}
            {showLabels && (
              <OverlayView
                position={vehicle.position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={(width, height) => ({
                  x: -width / 2,
                  y: -height - 35, // Position above the marker
                })}
              >
                <div className="px-2 w-[5rem] py-1 bg-slate-800 bg-opacity-75 text-white text-xs font-medium rounded shadow-md whitespace-nowrap">
                  {vehicle.plateNumber}
                </div>
              </OverlayView>
            )}
          </React.Fragment>
        ))}

        {/* Show info window for selected vehicle */}
        {selectedVehicle && (
          <InfoWindow
            position={selectedVehicle.position}
            onCloseClick={() => setSelectedVehicle(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold mb-1 text-lg">
                {selectedVehicle.plateNumber}
              </h3>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle ID:</span>
                  <span className="font-medium">
                    {selectedVehicle.vehicleId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Speed:</span>
                  <span className="font-medium">
                    {selectedVehicle.speed.toFixed(1)} km/h
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`font-medium ${
                      selectedVehicle.isActive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVehicle.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last seen:</span>
                  <span className="font-medium">
                    {new Date(selectedVehicle.lastSeen).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(selectedVehicle.lastSeen).toLocaleDateString()}
                </div>
              </div>
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
      <StatusOverlay />
      <ControlPanel />
    </div>
  );
};

export default MapSection;
