"use client";

import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartSkeleton, EmptyDataMessage, ErrorMessage } from "./fuelSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FuelDataItem {
  id: number;
  timestamp: string;
  fuelLevel: number;
  fuelConsumption: number;
  plateNumber: string;
  trackingDeviceId: number;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
}

interface LoadingState {
  fuel: boolean;
  vehicles: boolean;
  gps: boolean;
}

interface ErrorState {
  fuel: string | null;
  vehicles: string | null;
  gps: string | null;
}

interface FuelChartSectionProps {
  fuelData: FuelDataItem[];
  isLoading: LoadingState;
  error: ErrorState;
}

const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: { mode: "index" as const, intersect: false },
    legend: { position: "top" as const },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.1)" },
    },
    x: {
      grid: { display: false },
    },
  },
  maintainAspectRatio: false,
};

const FuelDataContext = React.createContext<{
  displayState: "loading" | "data" | "empty" | "error";
  sortedData: FuelDataItem[];
  errorMessage: string | null;
  stats: {
    currentFuelLevel: number;
    totalConsumption: number;
    avgConsumption: number;
    fuelDepletion: number;
  } | null;
  fuelLevelChartData: any;
  fuelConsumptionChartData: any;
}>({
  displayState: "loading",
  sortedData: [],
  errorMessage: null,
  stats: null,
  fuelLevelChartData: null,
  fuelConsumptionChartData: null,
});

const FuelChartData = () => {
  const { stats, fuelLevelChartData, fuelConsumptionChartData } =
    React.useContext(FuelDataContext);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fuel Level Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-sms">⛽ Fuel Level</h2>
        <div className="min-h-[400px]">
          <Line data={fuelLevelChartData} options={chartOptions} />
        </div>
      </div>

      {/* Fuel Consumption Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-sms">🔥 Fuel Consumption</h2>
        <div className="min-h-[400px]">
          <Bar data={fuelConsumptionChartData} options={chartOptions} />
        </div>
      </div>

      {/* Summary Cards Section */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-sms">📊 Fuel Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">
                Current Fuel Level
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.currentFuelLevel.toFixed(3)}...%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">
                Avg. Consumption
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.avgConsumption.toFixed(1)} L/100km
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">
                Total Consumption
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalConsumption.toFixed(1)} L/100km
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">
                Fuel Depletion
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.fuelDepletion.toFixed(3)}...%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FuelChartSection: React.FC<FuelChartSectionProps> = ({
  fuelData,
  isLoading,
  error,
}) => {
  // State to control what to display
  const [displayState, setDisplayState] = useState<
    "loading" | "data" | "empty" | "error"
  >("loading");
  const [sortedData, setSortedData] = useState<FuelDataItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    currentFuelLevel: number;
    totalConsumption: number;
    avgConsumption: number;
    fuelDepletion: number;
  } | null>(null);
  const [fuelLevelChartData, setFuelLevelChartData] = useState<any>(null);
  const [fuelConsumptionChartData, setFuelConsumptionChartData] =
    useState<any>(null);

  // Always show skeleton first, then process data
  useEffect(() => {
    setDisplayState("loading");

    // Simulate loading delay (remove this in production)
    const loadingTimer = setTimeout(() => {
      // Check for errors first
      if (error.fuel) {
        setErrorMessage(error.fuel);
        setDisplayState("error");
        return;
      }

      // If still loading, keep the loading state
      if (isLoading.fuel) {
        return;
      }

      // Process data if available
      if (fuelData && fuelData.length > 0) {
        // Sort data by timestamp
        const sorted = [...fuelData].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setSortedData(sorted);

        // Prepare chart data
        const dateTimeLabels = sorted.map((item) => {
          const date = new Date(item.timestamp);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        });

        // Set fuel level chart data
        setFuelLevelChartData({
          labels: dateTimeLabels,
          datasets: [
            {
              label: "Fuel Level (%)",
              data: sorted.map((item) => item.fuelLevel),
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });

        // Set fuel consumption chart data
        setFuelConsumptionChartData({
          labels: dateTimeLabels,
          datasets: [
            {
              label: "Fuel Consumption (L/100km)",
              data: sorted.map((item) => item.fuelConsumption),
              backgroundColor: "rgba(255, 99, 132, 0.8)",
            },
          ],
        });

        const currentFuelLevel = sorted[sorted.length - 1].fuelLevel;
        const totalConsumption = sorted.reduce(
          (sum, item) => sum + item.fuelConsumption,
          0
        ); // Remove the last element
        const avgConsumption = totalConsumption / sorted.length;
        const fuelDepletion =
          sorted[0].fuelLevel - sorted[sorted.length - 1].fuelLevel;

        setStats({
          currentFuelLevel,
          totalConsumption,
          avgConsumption,
          fuelDepletion,
        });

        setDisplayState("data");
      } else {
        // No data available
        setDisplayState("empty");
      }
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, [fuelData, isLoading.fuel, error.fuel]);

  const contextValue = {
    displayState,
    sortedData,
    errorMessage,
    stats,
    fuelLevelChartData,
    fuelConsumptionChartData,
  };

  return (
    <FuelDataContext.Provider value={contextValue}>
      {displayState === "loading" && <ChartSkeleton />}
      {displayState === "data" && <FuelChartData />}
      {displayState === "empty" && <EmptyDataMessage />}
      {displayState === "error" && (
        <ErrorMessage message={errorMessage || "An error occurred"} />
      )}
    </FuelDataContext.Provider>
  );
};

export default FuelChartSection;
