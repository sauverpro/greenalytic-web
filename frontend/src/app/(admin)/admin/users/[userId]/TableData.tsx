"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Trash,
  Edit,
  RefreshCw,
  Plus,
  Fuel,
  MapPin,
  Router,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { deleteVehicle, getVehiclesForUser } from "@/services/vehicleService";
import { AddVehicleModal } from "@/components/adminComponents/add-vehicle-modal";
import { getDevicesForVehicle } from "@/services/deviceServices";
import { AddDeviceModal } from "@/components/adminComponents/add-device-modal";

// Define types for our component
interface VehicleData {
  id: number;
  plateNumber: string;
  chassisNumber: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: number;
  usage: string;
  trackingDevices: TrackingDevice[];
  createdAt: string;
  updatedAt: string;
  userId: number;
}

interface TrackingDevice {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  isActive: boolean;
  status: string;
  lastPing: string;
  userId: number;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  gpsDatas?: any[];
}

interface VehicleTableProps {
  userId: string;
  onAddVehicle: () => void;
  onAddDevice: (vehicleId: number) => void;
}

export function VehicleTable({
  userId,
  onAddVehicle,
  onAddDevice,
}: VehicleTableProps) {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleData | null>(
    null
  );
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null
  );
  const isComponentMounted = useRef(true);

  useEffect(() => {
    if (userId) {
      fetchVehicles(userId);
    }
  }, [userId]);

  const fetchVehicles = async (userId: string) => {
    setLoading(true);
    try {
      const response = await getVehiclesForUser(userId);
      if (response && response.vehicles) {
        setVehicles(Array.isArray(response.vehicles) ? response.vehicles : []);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles data");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleDevices = async (vehicleId: number) => {
    setLoadingDevices(vehicleId);
    try {
      const response = await getDevicesForVehicle(vehicleId.toString());

      if (response && response.data) {
        // Update the vehicles state with the new device data without triggering rerender of other components
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) => {
            if (vehicle.id === vehicleId) {
              return {
                ...vehicle,
                trackingDevices: response.data,
              };
            }
            return vehicle;
          })
        );

        // Only show success toast when explicitly refreshing devices, not after adding
        if (!isAddDeviceModalOpen) {
          toast.success(`Loaded ${response.count} devices for vehicle`);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast.error("Failed to load device data");
    } finally {
      setLoadingDevices(null);
    }
  };

  // Handle add vehicle with proper error handling
  const handleAddVehicle = () => {
    try {
      setIsAddVehicleModalOpen(true);
    } catch (error) {
      console.error("Error in add vehicle:", error);
      toast.error("Failed to open add vehicle form");
    }
  };

  // Handle add device with proper error handling and open modal directly
  const handleAddDevice = (vehicle: VehicleData) => {
    try {
      // Store the vehicle data in state without triggering the parent handler
      setSelectedVehicle(vehicle);
      setIsAddDeviceModalOpen(true);

      // We don't call onAddDevice here anymore, as it triggers page reload
      // Instead we'll handle everything internally for a smoother experience
    } catch (error) {
      console.error("Error in add device:", error);
      if (isComponentMounted.current) {
        toast.error("Failed to open add device form");
      }
    }
  };

  // Handle closing device modal
  const handleDeviceModalClose = () => {
    // Close the modal first
    setIsAddDeviceModalOpen(false);

    // Then clear the selected vehicle with a slight delay to prevent UI flicker
    setTimeout(() => {
      if (isComponentMounted.current) {
        setSelectedVehicle(null);
      }
    }, 100);
  };

  // Handle successful device addition
  const handleDeviceAdded = () => {
    if (selectedVehicle) {
      // Just fetch devices for this specific vehicle without triggering parent reload
      fetchVehicleDevices(selectedVehicle.id);

      // Don't call onAddDevice here as it causes page reload
      // We'll still notify parent that a device was added through a modified approach
      toast.success(`Device added to ${selectedVehicle.plateNumber}`);
    }
  };

  // Handle edit vehicle
  const handleEditVehicle = (vehicle: VehicleData) => {
    try {
      console.log("Edit vehicle:", vehicle);
      if (isComponentMounted.current) {
        toast.info(`Editing vehicle ${vehicle.plateNumber}`);
      }
    } catch (error) {
      console.error("Error editing vehicle:", error);
      if (isComponentMounted.current) {
        toast.error("Failed to edit vehicle");
      }
    }
  };
  // Open delete confirmation
  const openDeleteConfirm = (vehicle: VehicleData) => {
    if (isComponentMounted.current) {
      setVehicleToDelete({ ...vehicle }); // Create a copy to ensure complete data retention
      setShowDeleteConfirm(true);
    }
  };
  // Close delete confirmation
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
  // Confirm and execute delete
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
  // Get device types for a vehicle
  const getDeviceTypes = (devices: TrackingDevice[]) => {
    if (!Array.isArray(devices)) return [];
    const deviceTypes = devices.map((device) => device.type);
    return [...new Set(deviceTypes)];
  };
  // Render device badges
  const renderDeviceBadges = (devices: TrackingDevice[]) => {
    if (!Array.isArray(devices) || devices.length === 0) {
      return <span className="text-muted-foreground text-sm">No devices</span>;
    }
    const deviceTypes = getDeviceTypes(devices);
    return (
      <div className="flex gap-1 flex-wrap">
        {deviceTypes.map((type, index) => {
          if (!type) return null;

          let icon;
          let colorClass;

          switch (type.toLowerCase()) {
            case "gps":
              icon = <MapPin className="mr-1 h-3 w-3" />;
              colorClass = "bg-blue-50 border-blue-200 text-blue-700";
              break;
            case "fuel":
              icon = <Fuel className="mr-1 h-3 w-3" />;
              colorClass = "bg-amber-50 border-amber-200 text-amber-700";
              break;
            case "emissions":
            case "emission":
              icon = <Router className="mr-1 h-3 w-3" />;
              colorClass = "bg-green-50 border-green-200 text-green-700";
              break;
            default:
              icon = null;
              colorClass = "bg-gray-50 border-gray-200";
          }

          return (
            <Badge key={index} variant="outline" className={colorClass}>
              {icon}
              {type}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vehicles</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchVehicles(userId)}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setIsAddVehicleModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {vehicles.length === 0
              ? "No vehicles found. Add a vehicle to get started."
              : `A list of ${vehicles.length} vehicles.`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Plate Number</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Tracking Devices</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-24 text-muted-foreground"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading vehicles...
                    </div>
                  ) : (
                    "No vehicles found. Click 'Add Vehicle' to create one."
                  )}
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.plateNumber}</TableCell>
                  <TableCell>{vehicle.vehicleModel}</TableCell>
                  <TableCell>{vehicle.vehicleType}</TableCell>
                  <TableCell>{vehicle.yearOfManufacture}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {vehicle.usage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {loadingDevices === vehicle.id ? (
                      <div className="flex items-center">
                        <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                        <span className="text-sm">Loading devices...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {renderDeviceBadges(vehicle.trackingDevices || [])}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => fetchVehicleDevices(vehicle.id)}
                          title="Refresh devices"
                        ></Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => fetchVehicleDevices(vehicle.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Devices
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddDevice(vehicle)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Device
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditVehicle(vehicle)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteConfirm(vehicle)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Vehicle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
                {vehicleToDelete.plateNumber}
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

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => {
          setIsAddVehicleModalOpen(false);
        }}
        userId={userId || ""}
        onSuccess={() => {
          fetchVehicles(userId);
          onAddVehicle();
        }}
      />

      {/* Add Device Modal */}
      {selectedVehicle && (
        <AddDeviceModal
          isOpen={isAddDeviceModalOpen}
          onClose={() => setIsAddDeviceModalOpen(false)}
          vehicleId={selectedVehicle.id.toString()}
          plateNumber={selectedVehicle.plateNumber}
          onSuccess={() => {
            handleDeviceAdded();
            // setIsAddDeviceModalOpen(false);
            setTimeout(() => handleDeviceModalClose(), 300);
          }}
        />
      )}
    </div>
  );
}
