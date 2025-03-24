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
} from "./emissionSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for the emissions data
interface EmissionsDataItem {
  id: number;
  timestamp: string;
  co2Percentage: number;
  coPercentage: number;
  o2Percentage: number;
  hcPPM: number;
  vehicleId: number;
  plateNumber: string;
  trackingDeviceId: number;
  createdAt: string;
}

interface LoadingState {
  emissions: boolean;
  vehicles: boolean;
  gps: boolean;
  fuel: boolean;
}

interface ErrorState {
  emissions: string | null;
  vehicles: string | null;
  gps: string | null;
  fuel: string | null;
}

interface EmissionsChartSectionProps {
  emissionsData: EmissionsDataItem[];
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

const EmissionsChartSection: React.FC<EmissionsChartSectionProps> = ({
  emissionsData,
  isLoading,
  error,
}) => {
  // State to control what to display
  const [displayState, setDisplayState] = useState<
    "loading" | "data" | "empty" | "error"
  >("loading");
  const [sortedData, setSortedData] = useState<EmissionsDataItem[]>([]);
  const [chartData, setChartData] = useState<{
    co2: any;
    co: any;
    o2: any;
    hc: any;
  }>({
    co2: null,
    co: null,
    o2: null,
    hc: null,
  });
  const [stats, setStats] = useState<{
    current: {
      co2: number;
      co: number;
      o2: number;
      hc: number;
    };
    average: {
      co2: number;
      co: number;
      o2: number;
      hc: number;
    };
  } | null>(null);

  // Always show skeleton first, then process data
  useEffect(() => {
    // Set initial loading state
    setDisplayState("loading");

    // Simulate loading delay (remove this in production)
    const loadingTimer = setTimeout(() => {
      // Check for errors first
      if (error.emissions) {
        setDisplayState("error");
        return;
      }

      // If still loading, keep the loading state
      if (isLoading.emissions) {
        return;
      }

      // Process data if available
      if (emissionsData && emissionsData.length > 0) {
        // Sort data by timestamp
        const sorted = [...emissionsData].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setSortedData(sorted);

        // Prepare combined date+time labels for x-axis
        const dateTimeLabels = sorted.map((item) => {
          const date = new Date(item.timestamp);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        });

        // Set chart data for all emissions types
        setChartData({
          co2: {
            labels: dateTimeLabels,
            datasets: [
              {
                label: "CO2 Percentage",
                data: sorted.map((item) => item.co2Percentage),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          co: {
            labels: dateTimeLabels,
            datasets: [
              {
                label: "CO Percentage",
                data: sorted.map((item) => item.coPercentage),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          o2: {
            labels: dateTimeLabels,
            datasets: [
              {
                label: "O2 Percentage",
                data: sorted.map((item) => item.o2Percentage),
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          hc: {
            labels: dateTimeLabels,
            datasets: [
              {
                label: "HC (PPM)",
                data: sorted.map((item) => item.hcPPM),
                borderColor: "rgb(255, 159, 64)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
        });

        // Calculate summary statistics
        const currentCO2 = sorted[sorted.length - 1].co2Percentage;
        const currentCO = sorted[sorted.length - 1].coPercentage;
        const currentO2 = sorted[sorted.length - 1].o2Percentage;
        const currentHC = sorted[sorted.length - 1].hcPPM;

        const avgCO2 =
          sorted.reduce((sum, item) => sum + item.co2Percentage, 0) /
          sorted.length;
        const avgCO =
          sorted.reduce((sum, item) => sum + item.coPercentage, 0) /
          sorted.length;
        const avgO2 =
          sorted.reduce((sum, item) => sum + item.o2Percentage, 0) /
          sorted.length;
        const avgHC =
          sorted.reduce((sum, item) => sum + item.hcPPM, 0) / sorted.length;

        setStats({
          current: {
            co2: currentCO2,
            co: currentCO,
            o2: currentO2,
            hc: currentHC,
          },
          average: {
            co2: avgCO2,
            co: avgCO,
            o2: avgO2,
            hc: avgHC,
          },
        });

        setDisplayState("data");
      } else {
        // No data available
        setDisplayState("empty");
      }
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(loadingTimer);
  }, [emissionsData, isLoading.emissions, error.emissions]);

  // Render based on display state
  if (displayState === "loading") {
    return <ChartSkeleton type="quad" height={300} />;
  }

  if (displayState === "error") {
    return <ErrorMessage message={error.emissions || "An error occurred"} />;
  }

  if (displayState === "empty") {
    return <EmptyDataMessage message="No emissions data available" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CO2 Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🏭 CO2 Emissions
        </h2>
        <div className="min-h-[300px]">
          <Line data={chartData.co2} options={chartOptions} />
        </div>
      </div>

      {/* CO Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🏭 CO Emissions
        </h2>
        <div className="min-h-[300px]">
          <Line data={chartData.co} options={chartOptions} />
        </div>
      </div>

      {/* O2 Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💨 O2 Levels</h2>
        <div className="min-h-[300px]">
          <Line data={chartData.o2} options={chartOptions} />
        </div>
      </div>

      {/* HC Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🔥 HC Emissions
        </h2>
        <div className="min-h-[300px]">
          <Line data={chartData.hc} options={chartOptions} />
        </div>
      </div>

      {/* Summary Cards Section */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📊 Emissions Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-teal-800">Current CO2</h3>
              <p className="text-2xl font-bold text-teal-600">
                {stats.current.co2.toFixed(1)}%
              </p>
              <p className="text-sm text-teal-600">
                Avg: {stats.average.co2.toFixed(1)}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Current CO</h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.current.co.toFixed(1)}%
              </p>
              <p className="text-sm text-red-600">
                Avg: {stats.average.co.toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Current O2</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.current.o2.toFixed(1)}%
              </p>
              <p className="text-sm text-blue-600">
                Avg: {stats.average.o2.toFixed(1)}%
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800">
                Current HC
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats.current.hc.toFixed(1)} PPM
              </p>
              <p className="text-sm text-orange-600">
                Avg: {stats.average.hc.toFixed(1)} PPM
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionsChartSection;
