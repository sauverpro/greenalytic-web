"use client";

import { Eye, Edit, Trash, MoreHorizontal, HardDrive } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { Pagination } from "@/components/DataTable/GenericDataTable";
import { getAllVehicles, deleteVehicle } from "@/services/vehicleService";
import type { ActionItem } from "@/components/DataTable/TableActions";
import { useEffect, useState } from "react";
import {
  exportToPDF,
  exportToExcel,
  printVehicles,
  type Vehicle,
} from "./ExportUtils";
import { toast } from "sonner";
// import { AddAndUpdateDeviceModal } from "@/components/adminComponents/add-device-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AddDeviceModal } from "@/components/adminComponents/add-device-modal";
import VehicleTable from "./VehicleTable";
function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
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
          email: vehicle.user?.email ?? "unknown@example.com",
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allVehicles.length / limit),
          totalItems: allVehicles.length,
          limit: limit,
        },
      };
    } catch (error) {
      toast.error("Failed to fetch vehicles.");
      return { data: [], pagination };
    }
  };
 const refetchVehicles = async () => {
    setLoading(true);
    const data = await fetchVehicles(pagination.currentPage, pagination.limit);
    setVehicles(data.data);
    setPagination(data.pagination);
    setLoading(false);
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
      icon: <Eye size={16} />,
    },
    {
      label: "Edit Vehicle",
      onClick: () => handleEditVehicle(vehicle),
      icon: <Edit size={16} />,
    },

    {
      label: "Delete Vehicle",
      onClick: () => handleDeleteVehicle(vehicle),
      variant: "destructive",
      icon: <Trash size={16} />,
    },
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
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const vehicleId = params.row.id;

        return (
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {/* View Details */}
                <DropdownMenuItem>viw details</DropdownMenuItem>

                {/* Add Device */}
                <DropdownMenuItem asChild>
                  {/* <AddDeviceModal
                    vehicleId={vehicleId.toString()}
                    plateNumber={params.row.licensePlate} // Pass the plate number here
                    // onClose={() => {
                    // }}
                    onSuccess={() => {
                      // optional toast or refetch
                      toast.success("Device operation successful");
                    }}
                  /> */}
                  <DropdownMenuItem
                    onClick={() => setIsAddDeviceModalOpen(true)}
                  >
                    <HardDrive className="mr-2 h-4 w-4" />
                    Add Device
                  </DropdownMenuItem>

                  <AddDeviceModal
                    isOpen={isAddDeviceModalOpen}
                    onClose={() => setIsAddDeviceModalOpen(false)}
                    vehicleId={vehicleId.toString()}
                    plateNumber={params.row.licensePlate}
                  />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Delete */}
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete Vehicle
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the vehicle and its
                          devices.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteVehicle(vehicleId)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
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
    <div className="h-full  w-full">
      <VehicleTable
        title="Vehicle Management"
        description="Manage all vehicles in one place"
        data={vehicles}
        loading={loading}
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
        // getRowActions={getVehicleActions}
        onPageChange={(newPage:any) => {
          setLoading(true);
          fetchVehicles(newPage, pagination.limit).then((data) => {
            setVehicles(data.data);
            setPagination(data.pagination);
            setLoading(false);
          });
        }}
        refetch={ refetchVehicles }
      />
    </div>
  );
}

export default VehiclesPage;
