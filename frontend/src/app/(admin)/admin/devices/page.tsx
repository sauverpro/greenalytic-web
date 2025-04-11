"use client";
import { HardDrive, Edit, Eye, Trash, PlusCircle } from "lucide-react";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/components/DataTable/GenericDataTable";
import { getAllDevices } from "@/services/deviceServices";
import type { ActionItem } from "@/components/DataTable/TableActions";
import { useState } from "react";
import {
  exportToPDF,
  exportToExcel,
  printDevices,
  type Device,
} from "./ExportUtils";

function DevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const fetchDevices = async (page = 1, limit = 10) => {
    try {
      const response = await getAllDevices();
      console.log("Fetched devices: ", response);

      const devices = response.data || [];

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDevices = devices.slice(startIndex, endIndex);

      return {
        data: paginatedDevices.map((device: any) => ({
          id: device.id,
          name: device.model || "Unknown Device",
          serialNumber: device.serialNumber,
          status: device.status,
          batteryLevel: Math.floor(Math.random() * 100),
          lastActive: device.lastPing || device.updatedAt,
          assignedTo: device.user?.username || "Unassigned",
          plateNumber: device.plateNumber,
          type: device.type,
          isActive: device.isActive,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(devices.length / limit),
          totalItems: devices.length,
          limit: limit,
        },
      };
    } catch (error) {
      console.error("Error fetching devices:", error);
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

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    console.log("Edit device:", device);
    // Here you would typically open a modal or navigate to edit page
  };

  const handleViewDevice = (device: Device) => {
    console.log("View device details:", device);
    // Navigate to device details page or open a modal
  };

  const handleDeleteDevice = (device: Device) => {
    console.log("Delete device:", device);
    // Show confirmation dialog and delete if confirmed
  };

  const handleAddDevice = () => {
    console.log("Add new device");
    // Open add device modal or navigate to add device page
  };

  const getDeviceActions = (device: Device): ActionItem[] => {
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
      field: "name",
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
      headerName: "Type",
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
      field: "assignedTo",
      headerName: "Assigned To",
      width: 150,
    },
  ];

  // Export handlers with proper error handling
  const handleExportPDF = (selectedDevices: Device[]) => {
    try {
      console.log("Export to PDF", selectedDevices);
      exportToPDF(selectedDevices);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  const handleExportExcel = (selectedDevices: Device[]) => {
    try {
      console.log("Export to Excel", selectedDevices);
      exportToExcel(selectedDevices);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  };

  const handlePrint = (selectedDevices: Device[]) => {
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
      <DataTable
        title="Device Management"
        description="Manage all tracking devices in one place"
        icon={<HardDrive size={20} />}
        columns={columns}
        fetchData={fetchDevices}
        addButtonLabel="Add Device"
        onAddItem={handleAddDevice}
        searchPlaceholder="Search devices by name, serial number..."
        searchFields={["name", "serialNumber", "status", "assignedTo"]}
        handleExportPDF={handleExportPDF}
        handleExportExcel={handleExportExcel}
        handlePrint={handlePrint}
        getRowActions={getDeviceActions}
      />
    </div>
  );
}

export default DevicesPage;
