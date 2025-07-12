"use client";

import type React from "react";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeviceDetailsModal } from "./device-details-model";
import { DeviceDetailsDrawer } from "./device-details-drawer";

type ClientDetailsProps = {};

const ClientDetails: React.FC<ClientDetailsProps> = (
  {
  }
) => {
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isDeviceDrawerOpen, setIsDeviceDrawerOpen] = useState(false);

  const devices = [
    { id: 1, name: "Device 1", type: "Sensor" },
    { id: 2, name: "Device 2", type: "Actuator" },
  ];

  return (
    <div>
      <h2>Client Details</h2>

      <h3>Devices</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.name}</td>
              <td>{device.type}</td>
              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDeviceId(device.id.toString());
                        setIsDeviceDrawerOpen(true);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Device</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <Trash className="mr-2 h-4 w-4" />
                      Remove Device
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button>Add Device</button>

      <button>Edit User</button>

      <div>AddDeviceModal</div>

      <div>EditUserDrawer</div>

      <DeviceDetailsModal

     
        deviceId={selectedDeviceId}
      />

      <DeviceDetailsDrawer
        open={isDeviceDrawerOpen}
        onOpenChange={setIsDeviceDrawerOpen}
        deviceId={selectedDeviceId}
      />
    </div>
  );
};

export default ClientDetails;
