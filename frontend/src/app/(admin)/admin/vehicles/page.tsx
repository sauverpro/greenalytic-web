"use client";

import { Car, Eye, Edit, Trash } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/components/DataTable/GenericDataTable";
import { getAllVehicles, deleteVehicle } from "@/services/vehicleService";
import type { ActionItem } from "@/components/DataTable/TableActions";
import { useState, useRef, useEffect } from "react";
import {
  exportToPDF,
  exportToExcel,
  printVehicles,
  type Vehicle,
} from "./ExportUtils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    // Initialize vehicles
    const initVehicles = async () => {
      const result = await fetchVehicles(1, 1000); // Fetch all for local state
      setVehicles(result.data);
    };

    initVehicles();

    // Cleanup function
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const fetchVehicles = async (page = 1, limit = 10) => {
    try {
      const response = await getAllVehicles();
      console.log("Fetched vehicles:", response);

      const vehicles = response || [];

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVehicles = vehicles.slice(startIndex, endIndex);

      return {
        data: paginatedVehicles.map((vehicle: any, index: number) => ({
          id: vehicle.id,
          no: startIndex + index + 1,
          model: vehicle.vehicleModel,
          year: vehicle.yearOfManufacture,
          licensePlate: vehicle.plateNumber,
          chassisNumber: vehicle.chassisNumber,
          vehicleType: vehicle.vehicleType,
          usage: vehicle.usage,
          owner: vehicle.user?.username || "Unknown",
          status: vehicle.deletedAt ? "inactive" : "active",
          email: vehicle.user?.email ?? "unknown@example.com",
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

  const handleViewVehicle = (vehicle: Vehicle) => {
    console.log("View vehicle details:", vehicle);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    console.log("Edit vehicle:", vehicle);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle(vehicleToDelete.id);

      if (isComponentMounted.current) {
        toast.success("Vehicle deleted successfully");
        setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete.id));
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      if (isComponentMounted.current) {
        toast.error("Failed to delete vehicle");
      }
    } finally {
      closeDeleteConfirm();
    }
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setVehicleToDelete(null);
  };

  const handleViewReports = (vehicle: Vehicle) => {
    console.log("View reports for vehicle:", vehicle);
  };

  const handleViewAnalytics = (vehicle: Vehicle) => {
    console.log("View analytics for vehicle:", vehicle);
  };

  const handleAddVehicle = () => {
    console.log("Add new vehicle");
  };

  const getVehicleActions = (vehicle: Vehicle): ActionItem[] => {
    return [
      // {
      //   label: "View Details",
      //   onClick: () => handleViewVehicle(vehicle),
      //   icon: <Eye size={16} />,
      // },
      // {
      //   label: "Edit Vehicle",
      //   onClick: () => handleEditVehicle(vehicle),
      //   icon: <Edit size={16} />,
      // },
      {
        label: "Delete Vehicle",
        onClick: () => handleDeleteVehicle(vehicle),
        variant: "destructive",
        icon: <Trash size={16} />,
      },
    ];
  };

  const columns: GridColDef[] = [
    { field: "no", headerName: "No", width: 70 },
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

  const handleExportPDF = (selectedVehicles: Vehicle[]) => {
    try {
      console.log("Export to PDF", selectedVehicles);
      exportToPDF(selectedVehicles);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  const handleExportExcel = (selectedVehicles: Vehicle[]) => {
    try {
      console.log("Export to Excel", selectedVehicles);
      exportToExcel(selectedVehicles);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  };

  const handlePrint = (selectedVehicles: Vehicle[]) => {
    try {
      console.log("Print vehicles", selectedVehicles);
      printVehicles(selectedVehicles);
    } catch (error) {
      console.error("Error printing vehicles:", error);
      alert("Failed to print. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-1 max-w-[100%]">
      <DataTable
        title="Vehicle Management"
        description="Manage all vehicles in one place"
        icon={<Car size={20} />}
        columns={columns}
        fetchData={fetchVehicles}
        addButtonLabel="Add Vehicle"
        onAddItem={handleAddVehicle}
        searchPlaceholder="Search vehicles by model, license plate..."
        searchFields={[
          "model",
          "licensePlate",
          "chassisNumber",
          "owner",
          "status",
        ]}
        handleExportPDF={handleExportPDF}
        handleExportExcel={handleExportExcel}
        handlePrint={handlePrint}
        getRowActions={getVehicleActions}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle?
              {vehicleToDelete && (
                <span className="font-medium block mt-2">
                  {vehicleToDelete.model} - {vehicleToDelete.licensePlate}
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteConfirm}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default VehiclesPage;
