"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CarMarker from "./CarMarker";
import CarSimulation from "./CarSimulation";
import { initialCars } from "./utils";

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

const MapComponent = () => {
  const [cars, setCars] = useState(initialCars);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        center={[-1.9403, 30.0596]}
        zoom={14}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cars.map((car, index) => (
          <CarMarker key={car.id} car={car} index={index} />
        ))}
      </MapContainer>

      <CarSimulation setCars={setCars} />
    </div>
  );
};

export default MapComponent;
