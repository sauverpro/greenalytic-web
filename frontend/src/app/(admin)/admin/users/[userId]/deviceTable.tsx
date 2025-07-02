// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Fuel,
//   MapPin,
//   Router,
//   MoreHorizontal,
//   Edit,
//   Trash,
//   Eye,
//   Plus,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
// import { DeviceDetailsModal } from "@/components/device/device-details-model";

// // Define the device interface
// export interface Device {
//   id: string;
//   serialNumber: string;
//   model: string;
//   type: "GPS" | "FUEL" | "EMISSION";
//   status: string;
//   lastPing?: string;
//   vehicle?: {
//     id: string;
//     plateNumber: string;
//     vehicleModel: string;
//   } | null;
// }

// interface DeviceTableProps {
//   devices: Device[];
//   isLoading?: boolean;
//   onAddDevice?: () => void;
//   onViewDevice?: (deviceId: string) => void;
//   onEditDevice?: (deviceId: string) => void;
//   onDeleteDevice?: (deviceId: string) => void;
// }

// export const DeviceTable = ({
//   devices = [],
//   isLoading = false,
//   onAddDevice,
//   onViewDevice,
//   onEditDevice,
//   onDeleteDevice,
// }: DeviceTableProps) => {
//   // State to track which device modal is open
//   const [modalDeviceId, setModalDeviceId] = useState<string | null>(null);
//   const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

//   const handleViewDevice = (deviceId: string) => {
//     if (onViewDevice) {
//       onViewDevice(deviceId);
//     } else {
//       // Fallback if no explicit handler is provided
//       setModalDeviceId(deviceId);
//       setIsDeviceModalOpen(true);
//     }
//   };

//   const handleEditDevice = (deviceId: string) => {
//     if (onEditDevice) {
//       onEditDevice(deviceId);
//     } else {
//       toast("Edit device action not implemented");
//     }
//   };

//   const handleDeleteDevice = (deviceId: string) => {
//     if (onDeleteDevice) {
//       onDeleteDevice(deviceId);
//     } else {
//       toast("Delete device action not implemented");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">Devices</h2>
//         {onAddDevice && (
//           <Button
//             className="bg-emerald-600 hover:bg-emerald-700"
//             onClick={onAddDevice}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add Device
//           </Button>
//         )}
//       </div>

//       <div className="rounded-lg border bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="border-b bg-muted/50 text-left">
//                 <th className="p-4 font-medium">Device ID</th>
//                 <th className="p-4 font-medium">Serial Number</th>
//                 <th className="p-4 font-medium">Model</th>
//                 <th className="p-4 font-medium">Type</th>
//                 <th className="p-4 font-medium">Vehicle</th>
//                 <th className="p-4 font-medium">Status</th>
//                 <th className="p-4 font-medium">Last Ping</th>
//                 <th className="p-4 font-medium text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {devices.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="p-4 text-center text-muted-foreground"
//                   >
//                     No devices found
//                   </td>
//                 </tr>
//               ) : (
//                 devices.map((device, index) => (
//                   <tr key={device.id} className="border-b hover:bg-muted/20">
//                     <td className="p-4">{index + 1}</td>
//                     <td className="p-4">{device.serialNumber}</td>
//                     <td className="p-4">{device.model}</td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         {device.type === "FUEL" && (
//                           <Fuel className="h-4 w-4 text-amber-500" />
//                         )}
//                         {device.type === "EMISSION" && (
//                           <Router className="h-4 w-4 text-green-500" />
//                         )}
//                         {device.type === "GPS" && (
//                           <MapPin className="h-4 w-4 text-blue-500" />
//                         )}
//                         <span>{device.type} Tracker</span>
//                       </div>
//                     </td>
//                     <td className="p-4 font-medium">
//                       {device.vehicle
//                         ? `${device.vehicle.plateNumber} (${device.vehicle.vehicleModel})`
//                         : "Unassigned"}
//                     </td>
//                     <td className="p-4">
//                       <Badge
//                         className={
//                           device.status === "active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-700"
//                         }
//                       >
//                         {device.status}
//                       </Badge>
//                     </td>
//                     <td className="p-4 text-muted-foreground">
//                       {device.lastPing
//                         ? new Date(device.lastPing).toLocaleString()
//                         : "N/A"}
//                     </td>
//                     <td className="p-4 text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => handleViewDevice(device.id)}
//                             className="cursor-pointer"
//                           >
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleEditDevice(device.id)}
//                             className="cursor-pointer"
//                           >
//                             <Edit className="mr-2 h-4 w-4" />
//                             Edit Device
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => handleDeleteDevice(device.id)}
//                             className="text-red-500 cursor-pointer"
//                           >
//                             <Trash className="mr-2 h-4 w-4" />
//                             Remove Device
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex items-center justify-between border-t px-6 py-3">
//           <div className="text-sm text-muted-foreground">
//             Showing {devices.length} of {devices.length} devices
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" disabled>
//               Previous
//             </Button>
//             <Button variant="outline" size="sm" disabled={devices.length <= 10}>
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Render the device details modal when a device is selected */}
//       {modalDeviceId && isDeviceModalOpen && (
//         <DeviceDetailsModal
//           deviceId={modalDeviceId}
//           open={isDeviceModalOpen}
//           onClose={() => {
//             setIsDeviceModalOpen(false);
//             setModalDeviceId(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };
