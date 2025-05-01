"use client";

import { Car, Eye, Edit, Trash, MoreHorizontal, HardDrive } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable, { Pagination } from "@/components/DataTable/GenericDataTable";
import { getAllVehicles, deleteVehicle } from "@/services/vehicleService";
import type { ActionItem } from "@/components/DataTable/TableActions";
import { FaEllipsisV, FaEye, FaEdit, FaHdd, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  exportToPDF,
  exportToExcel,
  printVehicles,
  type Vehicle
} from "./ExportUtils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AddDeviceModal } from "@/components/adminComponents/add-device-modal";
function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const fetchVehicles = async (page = 1, limit = 10) => {
    try {
      const response = await getAllVehicles();
      const allVehicles = response || [];

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVehicles = allVehicles.slice(startIndex, endIndex);

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
          email: vehicle.user?.email ?? "unknown@example.com"
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allVehicles.length / limit),
          totalItems: allVehicles.length,
          limit: limit
        }
      };
    } catch (error) {
      toast.error("Failed to fetch vehicles.");
      return { data: [], pagination };
    }
  };

  useEffect(() => {
    fetchVehicles(pagination.currentPage, pagination.limit).then((data) => {
      setVehicles(data.data);
      setPagination(data.pagination);
      setLoading(false);
    });
  }, []);

  const handleAddVehicle = () => {
    console.log("Add new vehicle");
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    console.log("View details", vehicle);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    console.log("Edit vehicle", vehicle);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    try {
      await deleteVehicle(vehicle.id);
      toast.success("Vehicle deleted successfully.");
      const data = await fetchVehicles(
        pagination.currentPage,
        pagination.limit
      );
      setVehicles(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to delete vehicle.");
    }
  };

  const getVehicleActions = (vehicle: Vehicle): ActionItem[] => [
    {
      label: "View Details",
      onClick: () => handleViewVehicle(vehicle),
      icon: <Eye size={16} />
    },
    {
      label: "Edit Vehicle",
      onClick: () => handleEditVehicle(vehicle),
      icon: <Edit size={16} />
    },

    {
      label: "Delete Vehicle",
      onClick: () => handleDeleteVehicle(vehicle),
      variant: "destructive",
      icon: <Trash size={16} />
    }
  ];

  const columns: GridColDef[] = [
    { field: "no", headerName: "No", width: 70 },
    { field: "model", headerName: "Model", width: 150 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "licensePlate", headerName: "License Plate", width: 150 },
    { field: "chassisNumber", headerName: "Chassis Number", width: 150 },
    {
      field: "vehicleType",
      headerName: "Type",
      width: 120,
      renderCell: (params) => {
        const types: Record<string, string> = {
          SUV: "green",
          Sedan: "purple",
          Truck: "orange"
        };
        const color = types[params.value] || "blue";
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
            {params.value}
          </div>
        );
      }
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
          }`}>
          {params.value}
        </div>
      )
    },
    { field: "owner", headerName: "Owner", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const color = params.value === "active" ? "green" : "red";
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
            {params.value}
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const vehicleId = params.row.id;
        const plateNumber = params.row.licensePlate;

        return (
          <div className="flex space-x-2">
            {/* View Button */}
            <button
              onClick={() => handleViewVehicle(params.row)}
              className="p-1 rounded-full hover:bg-gray-100"
              title="View Details">
              <Eye className="h-4 w-4" />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => handleEditVehicle(params.row)}
              className="p-1 rounded-full hover:bg-gray-100"
              title="Edit Vehicle">
              <Edit className="h-4 w-4" />
            </button>

            {/* Add Device Button */}
            <button
              onClick={() => {
                setSelectedVehicle({
                  ...params.row,
                  id: vehicleId,
                  plateNumber: plateNumber
                });
                setIsAddDeviceModalOpen(true);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              title="Add Device">
              <HardDrive className="h-4 w-4" />
            </button>

            {/* Delete Button with confirmation */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this vehicle? This will permanently delete the vehicle and its devices."
                  )
                ) {
                  handleDeleteVehicle(params.row);
                }
              }}
              className="p-1 rounded-full hover:bg-gray-100 text-red-600"
              title="Delete Vehicle">
              <Trash className="h-4 w-4" />
            </button>

            {/* Add Device Modal (keep this part) */}
            {selectedVehicle?.id === vehicleId && (
              <AddDeviceModal
                isOpen={isAddDeviceModalOpen}
                onClose={() => setIsAddDeviceModalOpen(false)}
                vehicleId={vehicleId.toString()}
                plateNumber={plateNumber}
                onSuccess={() => {
                  toast.success("Device operation successful");
                  setIsAddDeviceModalOpen(false);
                }}
              />
            )}
          </div>
        );
      }
    }
  ];

  const handleExportPDF = (selected: Vehicle[]) => {
    try {
      exportToPDF(selected);
    } catch (error) {
      toast.error("Failed to export to PDF.");
    }
  };

  const handleExportExcel = (selected: Vehicle[]) => {
    try {
      exportToExcel(selected);
    } catch (error) {
      toast.error("Failed to export to Excel.");
    }
  };

  const handlePrint = (selected: Vehicle[]) => {
    try {
      printVehicles(selected);
    } catch (error) {
      toast.error("Failed to print vehicles.");
    }
  };

  return (
    <div className="h-full flex flex-1 max-w-[100%]">
      <DataTable
        title="Vehicle Management"
        description="Manage all vehicles in one place"
        icon={<Car size={20} />}
        columns={columns}
        data={vehicles}
        pagination={pagination}
        loading={loading}
        addButtonLabel="Add Vehicle"
        onAddItem={handleAddVehicle}
        searchPlaceholder="Search vehicles by model, license plate..."
        searchFields={[
          "model",
          "licensePlate",
          "chassisNumber",
          "owner",
          "status"
        ]}
        handleExportPDF={handleExportPDF}
        handleExportExcel={handleExportExcel}
        handlePrint={handlePrint}
      
        onPageChange={(newPage) => {
          setLoading(true);
          fetchVehicles(newPage, pagination.limit).then((data) => {
            setVehicles(data.data);
            setPagination(data.pagination);
            setLoading(false);
          });
        }}
      />
    </div>
  );
}

export default VehiclesPage;
