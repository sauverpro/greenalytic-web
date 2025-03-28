"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ChartSkeleton,
  EmptyDataMessage,
  ErrorMessage,
} from "./gpsSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for the GPS data
interface GPSDataItem {
  id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  plateNumber?: string;
  trackingDeviceId?: number;
  vehicleId?: number;
  createdAt?: string;
  updatedAt?: string;
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

interface GPSChartSectionProps {
  gpsData: GPSDataItem[];
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

const GPSChartSection: React.FC<GPSChartSectionProps> = ({
  gpsData,
  isLoading,
  error,
}) => {
  // State to control what to display
  const [displayState, setDisplayState] = useState<
    "loading" | "data" | "empty" | "error"
  >("loading");
  const [sortedData, setSortedData] = useState<GPSDataItem[]>([]);
  const [speedChartData, setSpeedChartData] = useState<any>(null);
  const [stats, setStats] = useState<{
    currentSpeed: number;
    avgSpeed: number;
    maxSpeed: number;
    totalDistance: number;
  } | null>(null);

  // Always show skeleton first, then process data
  useEffect(() => {
    // Set initial loading state
    setDisplayState("loading");

    // Simulate loading delay (remove this in production)
    const loadingTimer = setTimeout(() => {
      // Check for errors first
      if (error.gps) {
        setDisplayState("error");
        return;
      }

      // If still loading, keep the loading state
      if (isLoading.gps) {
        return;
      }

      // Process data if available
      if (gpsData && gpsData.length > 0) {
        const sorted = [...gpsData].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setSortedData(sorted);

        const dateTimeLabels = sorted.map((item) => {
          const date = new Date(item.timestamp);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        });

        setSpeedChartData({
          labels: dateTimeLabels,
          datasets: [
            {
              label: "Speed (km/h)",
              data: sorted.map((item) => item.speed),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });

        // Calculate stats
        const speeds = sorted.map((item) => item.speed);
        const currentSpeed = sorted[sorted.length - 1].speed;
        const avgSpeed =
          speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
        const maxSpeed = Math.max(...speeds);
        const totalDistance = sorted.reduce((distance, item, index) => {
          if (index === 0) return 0;

          const prevLat = sorted[index - 1].latitude;
          const prevLng = sorted[index - 1].longitude;
          const currLat = item.latitude;
          const currLng = item.longitude;

          const R = 6371;
          const dLat = ((currLat - prevLat) * Math.PI) / 180;
          const dLng = ((currLng - prevLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((prevLat * Math.PI) / 180) *
              Math.cos((currLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const d = R * c;

          return distance + d;
        }, 0);

        setStats({
          currentSpeed,
          avgSpeed,
          maxSpeed,
          totalDistance,
        });

        setDisplayState("data");
      } else {
        // No data available
        setDisplayState("empty");
      }
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(loadingTimer);
  }, [gpsData, isLoading.gps, error.gps]);

  // Render based on display state
  if (displayState === "loading") {
    return <ChartSkeleton />;
  }

  if (displayState === "error") {
    return <ErrorMessage message={error.gps || "An error occurred"} />;
  }

  if (displayState === "empty") {
    return <EmptyDataMessage message="No GPS data available" />;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Speed Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🚗 Speed</h2>
        <div className="min-h-[400px]">
          <Line data={speedChartData} options={chartOptions} />
        </div>
      </div>

      {/* Summary Cards Section */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📊 GPS Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">
                Current Speed
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.currentSpeed.toFixed(3)}... km/h
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Avg. Speed</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.avgSpeed.toFixed(1)} km/h
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Max Speed</h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.maxSpeed.toFixed(1)} km/h
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">
                Total Distance
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalDistance.toFixed(2)} km
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPSChartSection;
