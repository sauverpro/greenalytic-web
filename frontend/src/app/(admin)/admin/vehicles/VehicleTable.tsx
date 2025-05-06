"use client";

import { Car, Eye, Edit, Trash, HardDrive, AlertTriangle } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable, { Pagination } from "@/components/DataTable/GenericDataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useRef } from "react";
import { AddDeviceModal } from "@/components/adminComponents/add-device-modal";
import { deleteVehicle } from "@/services/vehicleService";
import { Vehicle } from "./ExportUtils";
import { EditVehicleModal } from "@/components/adminComponents/edit-vehicle-model";

export interface VehicleTableProps {
  title: string;
  description: string;
  data: Vehicle[];
  loading: boolean;
  addButtonLabel: string;
  onAddItem?: () => void;
  searchFields: string[];
  searchPlaceholder: string;
  handleExportPDF: (selected: Vehicle[]) => void;
  handleExportExcel: (selected: Vehicle[]) => void;
  handlePrint: (selected: Vehicle[]) => void;
  onPageChange: (newPage: number) => void;
  refetch: () => Promise<void>;
}

export default function VehicleTable({
  data,
  loading,
  title,
  description,
  refetch,
}: VehicleTableProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null); // New state for vehicle to edit
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isComponentMounted = useRef(true);

  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Cleanup effect for unmounting
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    console.log("Viewing vehicle:", vehicle);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle); // Set the vehicle to edit
    setIsEditModalOpen(true); // Open the edit modal
    console.log("Editing vehicle:", vehicle);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    if (isComponentMounted.current) {
      setShowDeleteConfirm(false);

      // Use a timeout to ensure the UI updates before resetting state
      setTimeout(() => {
        if (isComponentMounted.current) {
          setVehicleToDelete(null);
        }
      }, 300);
    }
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicle(vehicleToDelete.id);

      if (isComponentMounted.current) {
        toast.success("Vehicle deleted successfully");
        await refetch();
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle");
    } finally {
      closeDeleteConfirm();
    }
  };

  const columns: GridColDef[] = [
    { field: "no", headerName: "No", width: 70 },
    { field: "model", headerName: "Model", width: 150 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "licensePlate", headerName: "Plate Plate", width: 150 },
    { field: "chassisNumber", headerName: "Chassis Number", width: 150 },
    {
      field: "vehicleType",
      headerName: "Type",
      width: 120,
      renderCell: (params) => {
        const types: Record<string, string> = {
          SUV: "green",
          Sedan: "purple",
          Truck: "orange",
        };
        const color = types[params.value] || "blue";
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}
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
    { field: "owner", headerName: "Owner", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const color = params.value === "active" ? "green" : "red";
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "actions",
      width: 300,
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const vehicle = params.row;

        return (
          <div className="flex gap-2 w-full overflow-x-auto justify-end">
            <button
              onClick={() => handleView(vehicle)}
              title="View"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(vehicle)}
              title="Edit"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedVehicle(vehicle);
                setIsAddDeviceModalOpen(true);
              }}
              title="Add Device"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <HardDrive className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(vehicle)}
              title="Delete"
              className="p-1 hover:bg-gray-100 text-red-600 rounded"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
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
          "status",
        ]}
        onPageChange={(newPage) => {
          console.log("Page changed to:", newPage);
        }}
      />

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vehicle={vehicleToEdit}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Device Modal */}
      {selectedVehicle && (
        <AddDeviceModal
          isOpen={isAddDeviceModalOpen}
          onClose={() => setIsAddDeviceModalOpen(false)}
          vehicleId={selectedVehicle.id.toString()}
          plateNumber={selectedVehicle.licensePlate}
          onSuccess={() => {
            toast.success("Device added.");
            setIsAddDeviceModalOpen(false);
            refetch();
          }}
        />
      )}

      {/* Custom Delete Confirmation Dialog */}
      {showDeleteConfirm && vehicleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center text-red-600 gap-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-lg font-medium">Confirm Vehicle Deletion</h3>
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the vehicle with plate number{" "}
              <span className="font-semibold">
                {vehicleToDelete.licensePlate}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone and all associated tracking devices
              will be unassigned.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeDeleteConfirm}>
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
