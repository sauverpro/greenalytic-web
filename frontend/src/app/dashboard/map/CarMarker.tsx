"use client";

import React from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import { Car } from "./utils";

const colors = ["#FF0000", "#00FF00", "#0000FF", "#FF00FF"];

interface CarMarkerProps {
  car: Car;
  index: number;
}

const CarMarker: React.FC<CarMarkerProps> = ({ car, index }) => {
  return (
    <>
      <Marker position={car.position}>
        <Popup>
          🚗 <strong>Car ID:</strong> {car.id} <br />
          <strong>Owner:</strong> {car.owner} <br />
          <strong>Lat:</strong> {car.position[0].toFixed(5)}, <br />
          <strong>Lng:</strong> {car.position[1].toFixed(5)} <br />
          <strong>Total Distance:</strong> {car.totalDistance.toFixed(3)} km
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
    </>
  );
};

export default CarMarker;
