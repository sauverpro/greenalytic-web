import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MapPin,
  Droplet,
  Wind,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for the data
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
  gps: boolean;
  fuel: boolean;
  emissions: boolean;
  vehicles: boolean;
}

interface ErrorState {
  gps: string | null;
  fuel: string | null;
  emissions: string | null;
  vehicles: string | null;
}

interface DashboardOverviewProps {
  gpsData: GPSDataItem[];
  fuelData: FuelDataItem[];
  emissionsData: EmissionsDataItem[];
  isLoading: LoadingState;
  error: ErrorState;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: {
    line: { tension: 0.4 },
    point: { radius: 0 },
  },
  maintainAspectRatio: false,
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  gpsData,
  fuelData,
  emissionsData,
  isLoading,
  error,
}) => {
  // Sort data by timestamp
  const sortedGpsData = [...gpsData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const sortedFuelData = [...fuelData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const sortedEmissionsData = [...emissionsData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate summary statistics
  const calculateGpsStats = () => {
    if (sortedGpsData.length === 0) return null;

    const speeds = sortedGpsData.map((item) => item.speed);
    const currentSpeed = sortedGpsData[sortedGpsData.length - 1].speed;
    const avgSpeed =
      speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const maxSpeed = Math.max(...speeds);

    // Calculate total distance (simplified)
    const totalDistance = sortedGpsData.reduce((distance, item, index) => {
      if (index === 0) return 0;

      const prevLat = sortedGpsData[index - 1].latitude;
      const prevLng = sortedGpsData[index - 1].longitude;
      const currLat = item.latitude;
      const currLng = item.longitude;

      // Using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = ((currLat - prevLat) * Math.PI) / 180;
      const dLng = ((currLng - prevLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((prevLat * Math.PI) / 180) *
          Math.cos((currLat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km

      return distance + d;
    }, 0);

    // Prepare mini chart data
    const speedChartData = {
      labels: sortedGpsData.map(() => ""),
      datasets: [
        {
          data: sortedGpsData.map((item) => item.speed),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    };

    return {
      currentSpeed,
      avgSpeed,
      maxSpeed,
      totalDistance,
      speedChartData,
    };
  };

  const calculateFuelStats = () => {
    if (sortedFuelData.length === 0) return null;

    const currentFuelLevel =
      sortedFuelData[sortedFuelData.length - 1].fuelLevel;
    const avgConsumption =
      sortedFuelData.reduce((sum, item) => sum + item.fuelConsumption, 0) /
      sortedFuelData.length;

    // Fuel level trend
    const fuelLevelChartData = {
      labels: sortedFuelData.map(() => ""),
      datasets: [
        {
          data: sortedFuelData.map((item) => item.fuelLevel),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    };

    return {
      currentFuelLevel,
      avgConsumption,
      fuelLevelChartData,
    };
  };

  const calculateEmissionsStats = () => {
    if (sortedEmissionsData.length === 0) return null;

    const currentCO2 =
      sortedEmissionsData[sortedEmissionsData.length - 1].co2Percentage;
    const avgCO2 =
      sortedEmissionsData.reduce((sum, item) => sum + item.co2Percentage, 0) /
      sortedEmissionsData.length;

    // CO2 trend
    const co2ChartData = {
      labels: sortedEmissionsData.map(() => ""),
      datasets: [
        {
          data: sortedEmissionsData.map((item) => item.co2Percentage),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };

    // Determine emissions status
    const co2Threshold = 150; 
    const coThreshold = 2.0; 

    const co2Status = currentCO2 < co2Threshold;
    const coStatus =
      sortedEmissionsData[sortedEmissionsData.length - 1].coPercentage <
      coThreshold;

    const overallStatus = co2Status && coStatus;

    return {
      currentCO2,
      avgCO2,
      co2ChartData,
      overallStatus,
    };
  };

  const gpsStats = calculateGpsStats();
  const fuelStats = calculateFuelStats();
  const emissionsStats = calculateEmissionsStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* GPS Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GPS Tracking</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading.gps ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading GPS data...</p>
            </div>
          ) : error.gps ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-red-500">{error.gps}</p>
            </div>
          ) : !gpsStats ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-muted-foreground">No GPS data available or select other date range </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {gpsStats.currentSpeed.toFixed(1)} km/h
                  </p>
                  <p className="text-xs text-muted-foreground">Current Speed</p>
                </div>
                <div className="h-[50px] w-[80px]">
                  <Line data={gpsStats.speedChartData} options={chartOptions} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium">
                    {gpsStats.totalDistance.toFixed(1)} km
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Distance
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {gpsStats.maxSpeed.toFixed(1)} km/h
                  </p>
                  <p className="text-xs text-muted-foreground">Max Speed</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Fuel Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fuel Status</CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading.fuel ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading fuel data...</p>
            </div>
          ) : error.fuel ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-red-500">{error.fuel}</p>
            </div>
          ) : !fuelStats ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-muted-foreground">No fuel data available or select other date range</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {fuelStats.currentFuelLevel.toFixed(3)}...%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current Fuel Level
                  </p>
                </div>
                <div className="h-[50px] w-[80px]">
                  <Line
                    data={fuelStats.fuelLevelChartData}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">
                  {fuelStats.avgConsumption.toFixed(1)} L/100km
                </p>
                <p className="text-xs text-muted-foreground">
                  Average Consumption
                </p>
              </div>
              <div className="mt-2">
                <div
                  className={`flex items-center ${
                    fuelStats.currentFuelLevel < 20
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {fuelStats.currentFuelLevel < 20 ? (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Low fuel warning</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Fuel level normal</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Emissions Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Emissions Status
          </CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading.emissions ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading emissions data...</p>
            </div>
          ) : error.emissions ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-red-500">{error.emissions}</p>
            </div>
          ) : !emissionsStats ? (
            <div className="h-[150px] flex items-center justify-center">
              <p className="text-muted-foreground">
                No emissions data available or select other date range
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {emissionsStats.currentCO2.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current CO2 Level
                  </p>
                </div>
                <div className="h-[50px] w-[80px]">
                  <Line
                    data={emissionsStats.co2ChartData}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">
                  {emissionsStats.avgCO2.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Average CO2 Level
                </p>
              </div>
              <div className="mt-2">
                <div
                  className={`flex items-center ${
                    emissionsStats.overallStatus
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {emissionsStats.overallStatus ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        Emissions within normal range
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Emissions above threshold</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
