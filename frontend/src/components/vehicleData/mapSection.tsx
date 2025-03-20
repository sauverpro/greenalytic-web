import React from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

interface MapSectionProps {
  currentLocation: { lat: number; lng: number };
  pathHistory: { lat: number; lng: number }[];
  isLoading: boolean;
  error: string | null;
}

const MapSection: React.FC<MapSectionProps> = ({
  currentLocation,
  pathHistory,
  isLoading,
}) => (
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
        >
          <Marker position={currentLocation} />
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
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
    </div>
  </div>
);

export default MapSection;
