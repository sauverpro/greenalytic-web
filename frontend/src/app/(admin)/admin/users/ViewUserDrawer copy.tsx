"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getUserVehicles } from "@/api/services/vehicleService";
import { User, Vehicle } from "@/types/types";

export default function ViewUserDrawer({
  open,
  onOpenChange,
  user
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUserVehicles(user.id.toString());
        setVehicles(response || []);
      } catch (err) {
        setError(`Failed to fetch vehicles ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  if (!user) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="right-0 left-auto h-full w-full sm:w-96 flex flex-col">
        <DrawerHeader>
          <DrawerTitle>User Details</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          {/* ✅ User Details */}
          <div className="border p-4 rounded-md bg-gray-100">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phoneNumber}
            </p>
          </div>

          {/* ✅ Vehicles List */}
          <div className="border p-4 rounded-md bg-gray-100">
            <h2 className="text-lg font-semibold">Registered Vehicles</h2>
            {loading ? (
              <p>Loading vehicles...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : vehicles.length === 0 ? (
              <p>No vehicles registered.</p>
            ) : (
              <ul className="space-y-2">
                {vehicles.map((vehicle) => (
                  <li key={vehicle.id} className="border p-2 rounded bg-white">
                    <p>
                      <strong>Plate:</strong> {vehicle.plateNumber}
                    </p>
                    <p>
                      <strong>Model:</strong> {vehicle.yearOfManufacture}
                    </p>
                    <p>
                      <strong>Type:</strong> {vehicle.fuelDatas?.map((fuelData, index) => (
                        <span key={index}>{fuelData.createdAt.toLocaleString()}: {fuelData.fuelLevel}</span>
                      ))}
                    </p>
                    <p>
                      <strong>Year:</strong> {vehicle.yearOfManufacture}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ✅ Footer Buttons */}
        <div className="p-4 flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
