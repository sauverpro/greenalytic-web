"use client";
import React, { useState, useEffect, Suspense } from "react";
import VehicleSelector from "../../../../components/vehicleData/vehicleSelector";
import DateRangePicker, {
  formatDateForServer,
} from "../../../../components/vehicleData/dateRangePicker";
import MapSection from "../../../../components/vehicleData/mapSection";
import { useLoadScript } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import GPSChartSection from "@/components/vehicleData/GPSchartSection";
import { DAY } from "@/utils/constants";
import { getGPSData } from "@/services/vehicleData";
import { getVehiclesByLoggedUser } from "@/services/vehicleService";

function GPSPageContent() {
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState(new Date(Date.now() - DAY));
  const [endDate, setEndDate] = useState(new Date());
  const [gpsData, setGpsData] = useState([]);
  const [error, setError] = useState({
    gps: null,
    vehicles: null,
    fuel: null,
  });
  const [isLoading, setIsLoading] = useState({
    gps: false,
    vehicles: false,
    fuel: false,
  });
  const [pathHistory, setPathHistory] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    lat: -1.9403,
    lng: 30.0596,
  });
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading((prev) => ({ ...prev, vehicles: true }));
      try {
        const response = await getVehiclesByLoggedUser();
        if (response.success) {
          setVehicles(response.data);

          const vehicleIdParam = searchParams.get("vehicleId");
          if (
            vehicleIdParam &&
            response.data.some((v: any) => v.id === parseInt(vehicleIdParam))
          ) {
            setSelectedVehicleId(parseInt(vehicleIdParam));
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
        setIsLoading((prev) => ({ ...prev, vehicles: false }));
      }
    };

    fetchVehicles();
  }, [searchParams]);

  const fetchGPSData = async () => {
    if (selectedVehicleId === null) return;

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
        if (response.data.length > 0) {
          const path = response.data.map((point: any) => ({
            lat: point.latitude,
            lng: point.longitude,
          }));
          setPathHistory(path);
          const mostRecent = response.data[response.data.length - 1];
          setCurrentLocation({
            lat: mostRecent.latitude,
            lng: mostRecent.longitude,
          });
        }
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
  };

  // Fetch all data when vehicle changes or date range changes
  useEffect(() => {
    if (selectedVehicleId !== null && initialLoadComplete) {
      fetchGPSData();
    }
  }, [selectedVehicleId, startDate, endDate, initialLoadComplete]);

  // Prepare for Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary mb-4">GPS Tracking</h1>
        <div className="flex md:block flex-col md:flex-row gap-4 mb-4">
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId || 0}
            onSelect={(id) => setSelectedVehicleId(id)}
            // isLoading={isLoading.vehicles}
            // error={error.vehicles}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            fetchAllData={fetchGPSData}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Map Section */}
        {isLoaded && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="h-[400px]">
              <MapSection
                currentLocation={currentLocation}
                pathHistory={pathHistory}
                isLoading={isLoading.gps}
                error={error.gps || null}
              />
            </div>
          </div>
        )}

        {/* Charts Section */}
        <GPSChartSection
          gpsData={gpsData}
          isLoading={isLoading}
          error={error}
        />

        {/* GPS Data Table */}
        {isLoading.gps ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <p className="text-center">Loading data...</p>
          </div>
        ) : gpsData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-sms">GPS Data Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      Time{" "}
                      <span className="text-xs lowercase">(Local Time)</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      Latitude
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      Longitude
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      Speed <span className="text-xs lowercase">(km/h)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gpsData.map((point: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(point.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {point.latitude.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {point.longitude.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {point.speed.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default function GPSPage() {
  return (
    <Suspense>
      <GPSPageContent />
    </Suspense>
  );
}
