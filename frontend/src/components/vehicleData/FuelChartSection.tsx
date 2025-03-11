import React from "react";
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

const FuelChartSection: React.FC<FuelChartSectionProps> = ({
  fuelData,
  isLoading,
  error,
}) => {
  // Sort data by timestamp to ensure chronological order
  const sortedData = [...fuelData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Prepare combined date+time labels for x-axis
  const dateTimeLabels = sortedData.map((item) => {
    const date = new Date(item.timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  });

  // Prepare data for Fuel Level chart
  const fuelLevelChartData = {
    labels: dateTimeLabels,
    datasets: [
      {
        label: "Fuel Level (%)",
        data: sortedData.map((item) => item.fuelLevel),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Prepare data for Fuel Consumption chart
  const fuelConsumptionChartData = {
    labels: dateTimeLabels,
    datasets: [
      {
        label: "Fuel Consumption (L/100km)",
        data: sortedData.map((item) => item.fuelConsumption),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
    ],
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (sortedData.length === 0) return null;

    const currentFuelLevel = sortedData[sortedData.length - 1].fuelLevel;
    const totalConsumption = sortedData.reduce(
      (sum, item) => sum + item.fuelConsumption,
      0
    );
    const avgConsumption = totalConsumption / sortedData.length;
    const fuelDepletion =
      sortedData[0].fuelLevel - sortedData[sortedData.length - 1].fuelLevel;

    return {
      currentFuelLevel,
      totalConsumption,
      avgConsumption,
      fuelDepletion,
    };
  };

  const stats = calculateStats();

  if (isLoading.fuel) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-64">
          <div className="text-gray-500">Loading fuel data...</div>
        </div>
      </div>
    );
  }

  if (error.fuel) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-64">
          <div className="text-red-500">{error.fuel}</div>
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-64">
          <div className="text-gray-500">
            No fuel data available for the selected time range
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fuel Level Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">⛽ Fuel Level</h2>
        <div className="min-h-[400px]">
          <Line data={fuelLevelChartData} options={chartOptions} />
        </div>
      </div>

      {/* Fuel Consumption Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🔥 Fuel Consumption
        </h2>
        <div className="min-h-[400px]">
          <Bar data={fuelConsumptionChartData} options={chartOptions} />
        </div>
      </div>

      {/* Summary Cards Section */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📊 Fuel Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">
                Current Fuel Level
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.currentFuelLevel}%
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
                {stats.fuelDepletion}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelChartSection;
