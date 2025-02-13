"use client";

import React, { useState, useEffect } from "react";
import { initialCars, calculateDistance, Car } from "./utils";

const CarSimulation = ({
  setCars
}: {
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => {
          const newLat = car.position[0] + (Math.random() - 0.5) * 0.001;
          const newLng = car.position[1] + (Math.random() - 0.5) * 0.001;

          const distance =
            car.history.length > 0
              ? calculateDistance(
                  car.position[0],
                  car.position[1],
                  newLat,
                  newLng
                )
              : 0;

          return {
            ...car,
            position: [newLat, newLng],
            history: [
              ...car.history,
              { lat: newLat, lng: newLng, timestamp: Date.now() }
            ].slice(-5000),
            totalDistance: car.totalDistance + distance
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [setCars]);

  return null;
};

export default CarSimulation;
