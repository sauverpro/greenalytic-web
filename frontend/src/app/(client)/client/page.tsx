"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import useAxiosClient from "../../../hooks/axiosClient";
import VehicleSelector from "../../../components/vehicleData/vehicleSelector";
import DateRangePicker, {
  formatDateForServer,
} from "../../../components/vehicleData/dateRangePicker";
import { useSearchParams } from "next/navigation";
import DashboardOverview from "@/components/vehicleData/dashboardOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Droplet, Wind } from "lucide-react";
import Link from "next/link";
import { DAY } from "@/utils/constants";
import {
  getEmissionsData,
  getFuelData,
  getGPSData,
} from "@/services/vehicleData";
import { getUserVehicles } from "@/services/vehicleService";

interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleModel: string;
  yearOfManufacture: string;
}

function DashboardPageContent() {
  const client = useAxiosClient();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(Date.now() - DAY)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isClient, setIsClient] = useState(false);

  const [gpsData, setGpsData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [emissionsData, setEmissionsData] = useState([]);

  const [error, setError] = useState({
    gps: null,
    fuel: null,
    emissions: null,
    vehicles: null,
  });
  const [isLoading, setIsLoading] = useState({
    gps: false,
    fuel: false,
    emissions: false,
    vehicles: false,
    initial: true,
  });

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchGPSData = useCallback(async () => {
    if (selectedVehicleId === null || !startDate || !endDate) return;

    setIsLoading((prev) => ({ ...prev, gps: true }));
    setError((prev) => ({ ...prev, gps: null }));

    try {
      const formattedStartDate = formatDateForServer(startDate);
      const formattedEndDate = formatDateForServer(endDate, true);

      const response = await getGPSData(selectedVehicleId, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      if (response.success) {
        setGpsData(response.data);
      } else {
        setError((prev: any) => ({ ...prev, gps: "Failed to fetch GPS data" }));
      }
    } catch (error) {
      setError((prev: any) => ({
        ...prev,
        gps: "Something went wrong while getting GPS data",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, gps: false }));
    }
  }, [selectedVehicleId, startDate, endDate]);

  const fetchFuelData = useCallback(async () => {
    if (selectedVehicleId === null || !startDate || !endDate) return;

    setIsLoading((prev) => ({ ...prev, fuel: true }));
    setError((prev) => ({ ...prev, fuel: null }));

    try {
      const formattedStartDate = formatDateForServer(startDate);
      const formattedEndDate = formatDateForServer(endDate, true);

      const response = await getFuelData(selectedVehicleId, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      if (response.success) {
        setFuelData(response.data);
      } else {
        setError((prev: any) => ({
          ...prev,
          fuel: "Failed to fetch fuel data",
        }));
      }
    } catch (error) {
      setError((prev: any) => ({
        ...prev,
        fuel: "Something went wrong while getting Fuel data",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, fuel: false }));
    }
  }, [selectedVehicleId, startDate, endDate]);

  const fetchEmissionsData = useCallback(async () => {
    if (selectedVehicleId === null || !startDate || !endDate) return;

    setIsLoading((prev) => ({ ...prev, emissions: true }));
    setError((prev) => ({ ...prev, emissions: null }));

    try {
      const formattedStartDate = formatDateForServer(startDate);
      const formattedEndDate = formatDateForServer(endDate, true);

      const response = await getEmissionsData(selectedVehicleId, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      if (response.success) {
        setEmissionsData(response.data);
      } else {
        setError((prev: any) => ({
          ...prev,
          emissions: "Failed to fetch emissions data",
        }));
      }
    } catch (error) {
      setError((prev: any) => ({
        ...prev,
        emissions: "Something went wrong while getting Emissions data",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, emissions: false }));
    }
  }, [selectedVehicleId, startDate, endDate]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!startDate) {
      setStartDate(new Date(Date.now() - DAY));
    }
    if (!endDate) {
      setEndDate(new Date());
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading((prev) => ({ ...prev, vehicles: true }));
      try {
        const response = await getUserVehicles();
        if (response.success) {
          setVehicles(response.data);

          const vehicleIdParam = searchParams.get("vehicleId");
          if (
            vehicleIdParam &&
            response.data.some(
              (v: any) => v.id === Number.parseInt(vehicleIdParam)
            )
          ) {
            setSelectedVehicleId(Number.parseInt(vehicleIdParam));
          } else if (response.data.length > 0) {
            setSelectedVehicleId(response.data[0].id);
          }

          setInitialLoadComplete(true);
        } else {
          setError((prev: any) => ({
            ...prev,
            vehicles: "Failed to fetch vehicles",
          }));
        }
      } catch (err) {
        setError((prev: any) => ({
          ...prev,
          vehicles: "Something went wrong while getting vehicles",
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, vehicles: false, initial: false }));
      }
    };

    fetchVehicles();
  }, [searchParams]);

  const fetchAllData = useCallback(async () => {
    if (selectedVehicleId === null || !startDate || !endDate) return;

    await Promise.all([fetchGPSData(), fetchFuelData(), fetchEmissionsData()]);
  }, [selectedVehicleId, fetchGPSData, fetchFuelData, fetchEmissionsData]);

  useEffect(() => {
    if (selectedVehicleId !== null && initialLoadComplete) {
      fetchAllData();
    }
  }, [
    selectedVehicleId,
    startDate,
    endDate,
    initialLoadComplete,
    fetchAllData,
  ]);

  const selectedVehicle =
    vehicles.find((v: any) => v.id === selectedVehicleId) || null;

  return (
    <div className="flex flex-col h-full  bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Vehicle Dashboard
        </h1>
        <div className="flex flex-col md:block gap-4 mb-4">
          {isLoading.vehicles ? (
            <div className="w-full md:w-64 h-10 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId || 0}
              onSelect={(id) => setSelectedVehicleId(id)}
            />
          )}
          {isClient && startDate && endDate && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              fetchAllData={fetchAllData}
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading.vehicles ? (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-muted-foreground">
                      Loading...
                    </p>
                    <div className="h-7 bg-gray-200 animate-pulse rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : selectedVehicle ? (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Plate Number
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedVehicle.plateNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Model
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedVehicle.vehicleModel || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Year
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedVehicle.yearOfManufacture || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Dashboard Overview */}
        <DashboardOverview
          gpsData={gpsData}
          fuelData={fuelData}
          emissionsData={emissionsData}
          isLoading={isLoading}
          error={error}
        />

        {/* Detailed Sections Tabs */}
        <Tabs defaultValue="gps" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="gps" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>GPS</span>
            </TabsTrigger>
            <TabsTrigger value="fuel" className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span>Fuel</span>
            </TabsTrigger>
            <TabsTrigger value="emissions" className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>Emissions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>GPS Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="md:flex block justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <p className="text-muted-foreground">
                      {gpsData.length > 0
                        ? `${gpsData.length} data points collected`
                        : "No recent GPS data available"}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`client/gps?vehicleId=${selectedVehicleId}`}
                      className="text-primary hover:underline"
                    >
                      View detailed GPS data →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fuel Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Fuel Status</h3>
                    <p className="text-muted-foreground">
                      {fuelData.length > 0
                        ? `${fuelData.length} fuel records collected`
                        : "No recent fuel data available"}
                    </p>
                  </div>
                  <Link
                    href={`/client/fuels?vehicleId=${selectedVehicleId}`}
                    className="text-primary hover:underline"
                  >
                    View detailed fuel data →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emissions Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Emissions Status</h3>
                    <p className="text-muted-foreground">
                      {emissionsData.length > 0
                        ? `${emissionsData.length} emission records collected`
                        : "No recent emissions data available"}
                    </p>
                  </div>
                  <Link
                    href={`/client/emissions?vehicleId=${selectedVehicleId}`}
                    className="text-primary hover:underline"
                  >
                    View detailed emissions data →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardPageContent />
    </Suspense>
  );
}
