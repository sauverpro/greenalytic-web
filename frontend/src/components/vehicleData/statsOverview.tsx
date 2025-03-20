
"use client";
import React from "react";

interface EmissionData {
  co2: number;
  co: number;
  no: number;
  HC: number;
}

interface FuelData {
  level: number;
}

interface GPSData {
  speed: number;
}

// Define props interface
interface StatsOverviewProps {
  emissionData: EmissionData[];
  fuelData: FuelData[];
  gpsData: GPSData[];
  isLoading: {
    emissions: boolean;
    fuel: boolean;
    gps: boolean;
  };
}


const StatsOverview:React.FC<StatsOverviewProps> = ({ emissionData, fuelData, gpsData, isLoading }) => {
  const latestEmission = emissionData.length > 0 ? emissionData[emissionData.length - 1] : null;
  const latestFuel = fuelData.length > 0 ? fuelData[fuelData.length - 1] : null;
  const latestGPS = gpsData.length > 0 ? gpsData[gpsData.length - 1] : null;

  const cardData = [
    {
      title: "Emission Status",
      icon: "🌍",
      color: "bg-red-100",
      gases: [
        { name: "CO₂", value: latestEmission ? latestEmission.co2: "0.0", unit: "ppm" },
        { name: "CO", value: latestEmission ? latestEmission.co  : "0.0", unit: "ppm" },
        { name: "NO", value: latestEmission ? latestEmission.no  : "0.0", unit: "ppm" },
        { name: "HC", value: latestEmission ? latestEmission.HC  : "0.0", unit: "ppm" },
      ],
    },
    {
      title: "Fuel Level",
      value: latestFuel ? `${latestFuel.level}L` : "0.0L",
      icon: "⛽",
      color: "bg-blue-100",
    },
    {
      title: "Current Speed",
      value: latestGPS ? `${latestGPS.speed} km/h` : "0.0 km/h",
      icon: "🚗",
      color: "bg-green-100",
    },
    {
      title: "Status",
      value: latestGPS ? "Active" : "Inactive",
      icon: "⏱️",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4 mt-4">
      {cardData.map((data, index) => (
        <div
          key={index}
          className={`${data.color} flex flex-col justify-between p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full h-auto min-h-[80px]`}
          >
          <div className="flex flex-col items-center justify-between">
            <div className="text-2xl sm:text-3xl md:text-4xl">{data.icon}</div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm md:text-lg font-semibold text-gray-600 truncate">{data.title}</p>
              {data.title === "Emission Status" ? (
                <ul className="mt-2 text-sm text-gray-700">
                  {data.gases?.map((gas, i) => (
                    <li key={i} className="grid grid-cols-2 gap-2 items-center text-xl">
                      <span className="font-medium">{gas.name}:</span>
                      <span>{gas.value} {gas.unit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {data.value}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
