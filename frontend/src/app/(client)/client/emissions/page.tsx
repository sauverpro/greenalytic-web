"use client";
import React, { useState, useEffect, Suspense } from "react";
import useAxiosClient from "../../../../hooks/axiosClient";
import VehicleSelector from "../../../../components/vehicleData/vehicleSelector";
import DateRangePicker, {
  formatDateForServer,
} from "../../../../components/vehicleData/dateRangePicker";
import { useSearchParams } from "next/navigation";
import EmissionsChartSection from "@/components/vehicleData/EmissionChartSection";

 function  EmissionsPageContent() {
  const client = useAxiosClient();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [emissionsData, setEmissionsData] = useState([]);
  const [error, setError] = useState({
    emissions: null,
    vehicles: null,
    gps: null,
    fuel: null,
  });
  const [isLoading, setIsLoading] = useState({
    emissions: false,
    vehicles: false,
    gps: false,
    fuel: false,
  });
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading((prev) => ({ ...prev, vehicles: true }));
      try {
        const response = await client.get("/vehicles");
        if (response.data.success) {
          setVehicles(response.data.data);

          const vehicleIdParam = searchParams.get("vehicleId");
          if (
            vehicleIdParam &&
            response.data.data.some(
              (v: any) => v.id === parseInt(vehicleIdParam)
            )
          ) {
            setSelectedVehicleId(parseInt(vehicleIdParam));
          } else if (response.data.data.length > 0) {
            setSelectedVehicleId(response.data.data[0].id);
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
          vehicles: "Error connecting to the server",
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, vehicles: false }));
      }
    };

    fetchVehicles();
  }, [ searchParams]);

  const fetchEmissionsData = async () => {
    if (selectedVehicleId === null) return;

    setIsLoading((prev) => ({ ...prev, emissions: true }));
    setError((prev) => ({ ...prev, emissions: null }));

    try {
      const formattedStartDate = formatDateForServer(startDate);
      const formattedEndDate = formatDateForServer(endDate, true);

      const response = await client.get(
        `/vehicles/${selectedVehicleId}/emissions/range`,
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );

      if (response.data.success) {
        setEmissionsData(response.data.data);
      } else {
        setError((prev: any) => ({
          ...prev,
          emissions: "Failed to fetch emissions data",
        }));
      }
    } catch (error) {
      setError((prev: any) => ({
        ...prev,
        emissions: "Error connecting to the server",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, emissions: false }));
    }
  };

  // Fetch emissions data when vehicle changes or date range changes
  useEffect(() => {
    if (selectedVehicleId !== null && initialLoadComplete) {
      fetchEmissionsData();
    }
  }, [selectedVehicleId, startDate, endDate, initialLoadComplete]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Emissions Monitoring
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId || 0}
            onSelect={(id) => setSelectedVehicleId(id)}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            fetchAllData={fetchEmissionsData}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Charts Section */}
        <EmissionsChartSection
          emissionsData={emissionsData}
          isLoading={isLoading}
          error={error}
        />

        {/* Emissions Data Table */}
        {emissionsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Emissions Data Table
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CO2 (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CO (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      O2 (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      HC (PPM)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {emissionsData.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.co2Percentage || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.coPercentage || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.o2Percentage || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.hcPPM || "N/A"}
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

export default function EmissionsPage() {
  return (
    <Suspense>
      <EmissionsPageContent />
    </Suspense>
  );
}
