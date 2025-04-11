"use client";
import React, { useState, useEffect, Suspense } from "react";
import VehicleSelector from "../../../../components/vehicleData/vehicleSelector";
import DateRangePicker, {
  formatDateForServer,
} from "../../../../components/vehicleData/dateRangePicker";
import { useSearchParams } from "next/navigation";
import FuelChartSection from "@/components/vehicleData/FuelChartSection";
import { DAY } from "@/utils/constants";
import { getFuelData } from "@/services/vehicleData";
import { getUserVehicles } from "@/services/vehicleService";

function FuelsPageContent() {
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState(new Date(Date.now() - DAY));
  const [endDate, setEndDate] = useState(new Date());
  const [fuelData, setFuelData] = useState([]);
  const [error, setError] = useState({
    fuel: null,
    vehicles: null,
    gps: null, // Add gps to error state
  });
  const [isLoading, setIsLoading] = useState({
    fuel: false,
    vehicles: false,
    gps: false, // Add gps to loading state
  });
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading((prev) => ({ ...prev, vehicles: true }));
      try {
        const response = await getUserVehicles();
        if (response.success) {
          setVehicles(response.data);

          // Set selected vehicle from URL params or first vehicle
          const vehicleIdParam = searchParams.get("vehicleId");
          if (
            vehicleIdParam &&
            response.some((v: any) => v.id === parseInt(vehicleIdParam))
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

  const fetchFuelData = async () => {
    if (selectedVehicleId === null) return;

    setIsLoading((prev) => ({ ...prev, fuel: true }));
    setError((prev) => ({ ...prev, fuel: null }));

    try {
      const formattedStartDate = formatDateForServer(startDate);
      const formattedEndDate = formatDateForServer(endDate, true);

      const response = await getFuelData(selectedVehicleId, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      console.log("Fuel Data Response:", response.data); // Debugging line

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
        fuel: "Something went wrong while getting fuel data",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, fuel: false }));
    }
  };

  // Fetch fuel data when vehicle changes or date range changes
  useEffect(() => {
    if (selectedVehicleId !== null && initialLoadComplete) {
      fetchFuelData();
    }
  }, [selectedVehicleId, startDate, endDate, initialLoadComplete]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Fuel Consumption
        </h1>
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
            fetchAllData={fetchFuelData}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Charts Section */}
        <FuelChartSection
          fuelData={fuelData}
          isLoading={isLoading}
          error={error}
        />

        {/* Fuel Data Table */}
        {fuelData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-sms">Fuel Data Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      Time{" "}
                      <span className="text-xs lowercase">(Local Time)</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      <div>
                        <p>Fuel Level</p>{" "}
                        <span className="text-xs lowercase"> (%)</span>
                      </div>
                    </th>
                    <th className=" px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      <div className="flex flex-col">
                        <p>Fuel Consumption </p>{" "}
                        <span className="text-xs lowercase">(L/100km)</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                      <div className="flex flex-col">
                        <p>Distance</p>{" "}
                        <span className="text-xs lowercase">(km)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fuelData.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.fuelLevel.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.fuelConsumption.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.distance || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FuelsPage() {
  return (
    <Suspense>
      <FuelsPageContent />
    </Suspense>
  );
}
