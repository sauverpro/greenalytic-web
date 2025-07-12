"use client";
import { Edit, Eye, Trash } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import { getAllDevices } from "@/services/deviceServices";
import type { ActionItem } from "@/components/DataTable/TableActions";
import { useState, useEffect } from "react";
import {
  exportToPDF,
  exportToExcel,
  printDevices,
} from "./ExportUtilsForDevices";
import type { TrackingDevice } from "@/types/types";
import TrackingDevicesTable from "./TrackingDevicesTable";
export interface TrackingDeviceWithVehicle extends TrackingDevice {
  vehicle: {
    id: number;
    plateNumber: string;
    vehicleType: string;
    vehicleModel: string;
  } | null;
}

function DevicesPage() {
  const [selectedDevice, setSelectedDevice] =
    useState<TrackingDeviceWithVehicle | null>(null);
  const [devices, setDevices] = useState<TrackingDeviceWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  useEffect(() => {
    fetchDevices(pagination.currentPage, pagination.limit);
  }, []);

  const fetchDevices = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await getAllDevices();
      console.log("Fetched devices: ", response);

      const allDevices = response.data || [];

      const totalItems = allDevices.length;
      const totalPages = Math.ceil(totalItems / limit);

      setPagination({
        currentPage: page,
        totalPages,
        totalItems,
        limit,
      });

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDevices = allDevices.slice(startIndex, endIndex);

      const formattedDevices = paginatedDevices.map((device: any) => ({
        id: device.id,
        model: device.model || "Unknown Device",
        serialNumber: device.serialNumber,
        status: device.status,
        type: device.type,
        plateNumber: device.plateNumber,
        isActive: device.isActive,
        lastPing: device.lastPing || device.updatedAt,
        assignedTo: device.user?.username || "Unassigned",
        userId: device.userId,
        vehicleId: device.vehicleId,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
      }));

      setDevices(formattedDevices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, limit: number) => {
    console.log(`Changing page to ${page} with limit ${limit}`);
    fetchDevices(page, limit);
  };

  const handleEditDevice = (device: TrackingDeviceWithVehicle) => {
    setSelectedDevice(device);
    console.log("Edit device:", device);
  };

  const handleViewDevice = (device: TrackingDeviceWithVehicle) => {
    console.log("View device details:", device);
  };

  const handleDeleteDevice = (device: TrackingDeviceWithVehicle) => {
    console.log("Delete device:", device);
  };

  const handleAddDevice = () => {
    console.log("Add new device");
  };

  const getDeviceActions = (
    device: TrackingDeviceWithVehicle
  ): ActionItem[] => {
    return [
      {
        label: "View Details",
        onClick: () => handleViewDevice(device),
        icon: <Eye size={16} />,
      },
      {
        label: "Edit Device",
        onClick: () => handleEditDevice(device),
        icon: <Edit size={16} />,
      },
      {
        label: "Delete Device",
        onClick: () => handleDeleteDevice(device),
        variant: "destructive",
        icon: <Trash size={16} />,
      },
    ];
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "model",
      headerName: "Device Model",
      width: 180,
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: "serialNumber",
      headerName: "Serial Number",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        let bgColor = "bg-gray-100";
        let textColor = "text-sms";

        if (params.value === "active") {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
        } else if (params.value === "inactive") {
          bgColor = "bg-red-100";
          textColor = "text-red-700";
        } else if (params.value === "maintenance") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
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
      field: "type",
      headerName: "Device Type",
      width: 120,
    },
    {
      field: "plateNumber",
      headerName: "Vehicle Plate",
      width: 150,
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            params.value
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {params.value ? "Yes" : "No"}
        </div>
      ),
    },
    {
      field: "lastPing",
      headerName: "Last Ping",
      width: 180,
      renderCell: (params) => (
        <div>
          {params.value ? new Date(params.value).toLocaleString() : "N/A"}
        </div>
      ),
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      width: 150,
    },
    {
      field: "vehicleId",
      headerName: "Vehicle ID",
      width: 100,
    },
  ];

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
    <div className="h-full flex flex-1 max-w-[100%]">
      <TrackingDevicesTable trackingDevices={devices} loading={loading} />
    </div>
  );
}

export default DevicesPage;
