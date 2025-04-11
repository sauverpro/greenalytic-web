"use client";
import { Car } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/components/DataTable/GenericDataTable";
import { getAllVehicles } from "@/services/vehicleService";
import { User } from "@/types/types";

interface Vehicle extends Omit<User, "id"> {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  owner: string;
  status: string;
  email: string; // Ensure compatibility with User's email property
  role: "ADMIN" | "USER" | "TECHNICIAN" | "MANAGER"; // Ensure compatibility with User's role property
  // Add other properties as needed
}


function VehiclesPage() {
  // Fetch vehicles with pagination
  const fetchVehicles = async (page = 1, limit = 10) => {
    try {
      const response = await getAllVehicles();
      console.log("Fetched vehicles:", response);

      // The response is already an array of vehicles
      const vehicles = response || [];

      // Assuming the API doesn't support pagination yet
      // You would need to implement pagination on the client side
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVehicles = vehicles.slice(startIndex, endIndex);

      return {
        data: paginatedVehicles.map((vehicle:any) => ({
          id: vehicle.id,
        //   make: vehicle.vehicleModel?.split(" ")[0] || "Unknown",
          model:
            vehicle.vehicleModel,
          year: vehicle.yearOfManufacture,
          licensePlate: vehicle.plateNumber,
          chassisNumber: vehicle.chassisNumber,
          vehicleType: vehicle.vehicleType,
          usage: vehicle.usage,
          owner: vehicle.user?.username || "Unknown",
          status: vehicle.deletedAt ? "inactive" : "active",
          email: vehicle.user?.email ?? "unknown@example.com", // Ensure email is always a string
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(vehicles.length / limit),
          totalItems: vehicles.length,
          limit: limit,
        },
      };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: limit,
        },
      };
    }
  };

  // Define columns for vehicles
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "model",
      headerName: "Model",
      width: 150,
    },
    {
      field: "year",
      headerName: "Year",
      width: 100,
    },
    {
      field: "licensePlate",
      headerName: "License Plate",
      width: 150,
    },
    {
      field: "chassisNumber",
      headerName: "Chassis Number",
      width: 150,
    },
    {
      field: "vehicleType",
      headerName: "Type",
      width: 120,
      renderCell: (params) => {
        let bgColor = "bg-blue-100";
        let textColor = "text-blue-700";

        if (params.value === "SUV") {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
        } else if (params.value === "Sedan") {
          bgColor = "bg-purple-100";
          textColor = "text-purple-700";
        } else if (params.value === "Truck") {
          bgColor = "bg-orange-100";
          textColor = "text-orange-700";
        }

        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "usage",
      headerName: "Usage",
      width: 120,
      renderCell: (params) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            params.value === "Personal"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "owner",
      headerName: "Owner",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const bgColor =
          params.value === "active" ? "bg-green-100" : "bg-red-100";
        const textColor =
          params.value === "active" ? "text-green-700" : "text-red-700";

        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {params.value}
          </div>
        );
      },
    },
  ];

  // Export functions
  const handleExportPDF = (selectedVehicles: Vehicle[]) => {
    console.log("Export to PDF", selectedVehicles);
    // Implement your PDF export logic
  };

  const handleExportExcel = (selectedVehicles: Vehicle[]) => {
    console.log("Export to Excel", selectedVehicles);
    // Implement your Excel export logic
  };

  return (
    <div className="h-full flex flex-1 max-w-[100%]">
      <DataTable<Vehicle>
        title="Vehicle Management"
        description="Manage all vehicles in one place"
        icon={<Car size={20} />}
        columns={columns}
        fetchData={fetchVehicles}
        // addButtonLabel="Add Vehicle"
        // onAddItem={() => console.log("Add vehicle clicked")}
        searchPlaceholder="Search vehicles by make, model, license plate..."
        searchFields={["make", "model", "licensePlate", "owner", "status"]}
        handleExportPDF={handleExportPDF}
        handleExportExcel={handleExportExcel}
      />
    </div>
  );
}

export default VehiclesPage;