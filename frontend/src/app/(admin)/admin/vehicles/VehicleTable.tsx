"use client";

import { Car, Eye, Edit, Trash, HardDrive } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable, { Pagination } from "@/components/DataTable/GenericDataTable";

import { toast } from "sonner";
import { useState } from "react";
import { AddDeviceModal } from "@/components/adminComponents/add-device-modal";
import { deleteVehicle } from "@/services/vehicleService";
import { Vehicle } from "./ExportUtils";

interface VehicleTableProps {
  data: Vehicle[];
  loading: boolean;
  title: string;
  description: string;
  refetch: () => Promise<void>;
}

export default function VehicleTable({
  data,
  loading,
  title,
  description,
  refetch
}: VehicleTableProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10
    });

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    console.log("Viewing vehicle:", vehicle);
  };

  const handleEdit = (vehicle: Vehicle) => {
    console.log("Editing vehicle:", vehicle);
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (
      confirm(
        "Are you sure you want to delete this vehicle? This will also delete its devices."
      )
    ) {
      try {
        await deleteVehicle(vehicle.id);
        toast.success("Vehicle deleted.");
        await refetch();
      } catch {
        toast.error("Failed to delete vehicle.");
      }
    }
  };

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
        const vehicle = params.row;

        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(vehicle)}
              title="View"
              className="p-1 hover:bg-gray-100 rounded">
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(vehicle)}
              title="Edit"
              className="p-1 hover:bg-gray-100 rounded">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedVehicle(vehicle);
                setIsAddDeviceModalOpen(true);
              }}
              title="Add Device"
              className="p-1 hover:bg-gray-100 rounded">
              <HardDrive className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(vehicle)}
              title="Delete"
              className="p-1 hover:bg-gray-100 text-red-600 rounded">
              <Trash className="w-4 h-4" />
            </button>

            {selectedVehicle?.id === vehicle.id && (
              <AddDeviceModal
                isOpen={isAddDeviceModalOpen}
                onClose={() => setIsAddDeviceModalOpen(false)}
                vehicleId={vehicle.id.toString()}
                plateNumber={vehicle.plateNumber}
                onSuccess={() => {
                  toast.success("Device added.");
                  setIsAddDeviceModalOpen(false);
                  refetch();
                }}
              />
            )}
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      title={title}
      description={description}
      icon={<Car size={20} />}
      pagination={pagination}
      columns={columns}
      data={data}
      loading={loading}
      addButtonLabel="Add Vehicle"
      onAddItem={() => console.log("Open add vehicle modal")}
      searchPlaceholder="Search vehicles..."
      searchFields={[
        "model",
        "licensePlate",
        "chassisNumber",
        "owner",
        "status"
      ]}
      onPageChange={(newPage) => {
        console.log("Page changed to:", newPage);
    
      }}
    />
  );
}
