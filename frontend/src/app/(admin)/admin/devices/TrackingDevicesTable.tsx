
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDevicesByUser } from "@/services/deviceServices";
import { type TrackingDevice } from "@/types/types";
import type { GridColDef } from "@mui/x-data-grid";
import { Edit, Eye, HardDrive, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
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
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  exportToPDF,
  exportToExcel,
  printDevices,

} from "./ExportUtilsForDevices";
// import { AddAndUpdateDeviceModal } from "@/components/adminComponents/add-device-modal";
import DataTable, { Pagination } from "@/components/DataTable/GenericDataTable";
import { DeviceDetailsModal } from "@/components/device/device-details-model";
// import AddAndUpdateDeviceModal from "@/components/adminComponents/add-device-modal";
export interface TrackingDeviceWithVehicle extends TrackingDevice {
  vehicle: {
    id: number;
    plateNumber: string;
    vehicleType: string;
    vehicleModel: string;
  } | null;
}


interface TrackingDevicesTableProps {
  trackingDevices: TrackingDeviceWithVehicle[];

  loading: boolean;

  onAddItem?: () => void;
  onEditItem?: (device: TrackingDeviceWithVehicle) => void;
  onDeleteItem?: (device: TrackingDeviceWithVehicle) => void;
}
  const handlePageChange = (page: number, limit: number) => {

  };

 
  const handleViewDevice = (device: TrackingDeviceWithVehicle) => {
    console.log("view device:", device);
  };
  const handleDeleteDevice = (device: TrackingDeviceWithVehicle) => {
    console.log("delete device:", device);
  };

const TrackingDevicesTable = ({
  trackingDevices,
  loading,
onDeleteItem,
  onEditItem,
  onAddItem
}: TrackingDevicesTableProps) => {
    const [selectedDevice, setSelectedDevice] =
      useState<TrackingDeviceWithVehicle | null>(null);
       const [pagination, setPagination] = useState({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: 10,
        });
        const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
const columns: GridColDef[] = [
  {
    field: "serialNumber",
    headerName: "Serial No",
    flex: 1,
    renderCell: (params) => (
      <div className="font-medium">{params.value || "N/A"}</div>
    )
  },
  {
    field: "model",
    headerName: "Model",
    flex: 1,
    renderCell: (params) => (
      <div className="capitalize">{params.value || "Unknown"}</div>
    )
  },
  {
    field: "type",
    headerName: "Type",
    flex: 1,
    renderCell: (params) => (
      <div className="uppercase">{params.value || "N/A"}</div>
    )
  },
  {
    field: "vehiclePlate",
    headerName: "Plate Number",
    flex: 1,
    renderCell: (params) => (
      <div>{params.row.vehicle?.plateNumber || "N/A"}</div>
    )
  },
  {
    field: "vehicleType",
    headerName: "Vehicle Type",
    flex: 1,
    renderCell: (params) => (
      <div>{params.row.vehicle?.vehicleType || "N/A"}</div>
    )
  },
  {
    field: "vehicleModel",
    headerName: "Vehicle Model",
    flex: 1,
    renderCell: (params) => (
      <div>{params.row.vehicle?.vehicleModel || "N/A"}</div>
    )
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      let color = "text-gray-700";
      if (params.value === "active") color = "text-green-600";
      if (params.value === "inactive") color = "text-red-600";
      return (
        <span className={`font-semibold capitalize ${color}`}>
          {params.value || "Unknown"}
        </span>
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
      const device = params.row as TrackingDeviceWithVehicle;
      return (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <DeviceDetailsModal deviceId={String(device.id)} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                add the device
                {/* <AddAndUpdateDeviceModal
         
                  onSuccess={() => {
                    setIsAddDeviceModalOpen(false);
                  }}
                /> */}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete the device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteDevice(device)}
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
    }
  }
];

  const handleEditDevice = (device: TrackingDeviceWithVehicle) => {
    setSelectedDevice(device);
    setIsAddDeviceModalOpen(true);
    console.log("Edit device:", device);
  };

  const handleViewDevice = (device: TrackingDeviceWithVehicle) => {
    console.log("View device details:", device);
  };

  const handleDeleteDevice = (device: TrackingDeviceWithVehicle) => {
    console.log("Delete device:", device);
  };
  const handleExportPDF = (selectedDevices: TrackingDeviceWithVehicle[]) => {
    try {
      console.log("Export to PDF", selectedDevices);
      exportToPDF(selectedDevices);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  const handleExportExcel = (selectedDevices: TrackingDeviceWithVehicle[]) => {
    try {
      console.log("Export to Excel", selectedDevices);
      exportToExcel(selectedDevices);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  };

  const handlePrint = (selectedDevices: TrackingDeviceWithVehicle[]) => {
    try {
      console.log("Print devices", selectedDevices);
      printDevices(selectedDevices);
    } catch (error) {
      console.error("Error printing devices:", error);
      alert("Failed to print. Please try again.");
    }
  };



  return (
    <div className="container mx-auto px-4 py-6 w-full overflow-hidden">
      <Card className="w-full bg-white shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-sms flex items-center gap-2">
                Tracking Devices
              </CardTitle>
              <CardDescription className="text-sms">
                List of devices associated with the user
              </CardDescription>
            </div>
            {onAddItem && (
              <Button
                onClick={onAddItem}
                variant="default"
                className="bg-primary hover:bg-primary-dark text-white rounded-md shadow-sm">
                <Plus size={16} className="mr-1" /> Add New Device
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <DataTable
            title="Device Management"
            description="Manage all tracking devices in one place"
            icon={<HardDrive size={20} />}
            columns={columns}
            data={trackingDevices}
            pagination={pagination}
            loading={loading}
            onPageChange={handlePageChange}
            addButtonLabel="Add Device"
            onAddItem={onAddItem}
            searchPlaceholder="Search devices by name, serial number..."
            searchFields={["name", "serialNumber", "status", "assignedTo"]}
            handleExportPDF={handleExportPDF}
            handleExportExcel={handleExportExcel}
            handlePrint={handlePrint}
            // getRowActions={getDeviceActions}
          />
        </CardContent>
      </Card>
      {/* Add Device Modal */}
    
    </div>
  );
};

export default TrackingDevicesTable;