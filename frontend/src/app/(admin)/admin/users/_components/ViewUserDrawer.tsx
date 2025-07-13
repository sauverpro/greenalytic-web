"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getVehiclesByLoggedUser,
  getVehiclesForUser,
} from "../../../../../services/vehicleService";
import { User, Vehicle } from "@/types/types";
import { Car, Phone, Mail, User as UserIcon, Fuel } from "lucide-react";

export default function ViewUserDrawer({
  open,
  onOpenChange,
  user,
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
        const response = await getVehiclesForUser(user.id.toString());
        setVehicles(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(`Failed to fetch vehicles: ${err}`);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  return (
    <Drawer
      open={open && user !== null}
      onOpenChange={onOpenChange}
      direction="right"
    >
      <DrawerContent className="w-full h-full flex flex-col bg-white border-l border-gray-200 shadow-lg">
        <DrawerHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <DrawerTitle className="text-xl font-bold">
              {user?.username || "User Details"}
            </DrawerTitle>
            {user && (
              <Badge variant="outline" className="text-white border-white">
                ID: {user.id}
              </Badge>
            )}
          </div>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {user && (
          <div className="flex flex-col md:flex-row p-6 gap-6 overflow-y-auto">
            {/* User Profile Card */}
            <Card className="bg-white shadow-md w-full md:w-64 h-fit">
              <CardHeader className="pb-2 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-2">
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-bold">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-sms">
                  {user.username}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sms">
                    <Mail size={16} />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sms">
                    <Phone size={16} />
                    <span className="text-sm">
                      {user.phoneNumber || "No phone"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sms">
                    <UserIcon size={16} />
                    <span className="text-sm">
                      {user.role || "Standard User"}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-sms">Registered</span>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString() // Ensure it's a Date object
                      : "N/A"}
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-sms">Status</span>
                    <Badge
                      // variant={user.isActive ? "success" : "destructive"}
                      className="text-xs px-2"
                    >
                      {/* {user.isActive ? "Active" : "Inactive"} */}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicles Section */}
            <div className="flex-1">
              <div className="bg-white shadow-md rounded-md overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Car size={18} />
                    <h3 className="text-lg font-semibold text-sms">
                      Registered Vehicles
                    </h3>
                  </div>
                  <Badge className="bg-blue-500">
                    {vehicles.length}{" "}
                    {vehicles.length === 1 ? "Vehicle" : "Vehicles"}
                  </Badge>
                </div>

                <div className="p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600">
                      <p>{error}</p>
                    </div>
                  ) : vehicles.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-center">
                      <Car size={24} className="mx-auto text-sms mb-2" />
                      <p className="text-sms">
                        No vehicles registered for this user.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                              Plate
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                              Model
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
                              <div className="flex items-center gap-1">
                                <Fuel size={14} />
                                <span>Fuel</span>
                              </div>
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-sms uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Array.isArray(vehicles) &&
                            vehicles.map((vehicle) => (
                              <tr key={vehicle.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Car
                                        size={16}
                                        className="text-blue-600"
                                      />
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-sms">
                                        {vehicle.plateNumber}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-sms">
                                  {vehicle.vehicleModel}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {vehicle.vehicleType}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {Array.isArray(vehicle.fuelDatas) &&
                                  vehicle.fuelDatas.length ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-green-500 h-2 rounded-full"
                                          style={{
                                            width: `${vehicle.fuelDatas[0].fuelLevel}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium">
                                        {vehicle.fuelDatas[0].fuelLevel}%
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-sms">
                                      No data
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                      Details
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                      Fuel Log
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="p-4 border-t bg-gray-50 mt-auto">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {user && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Edit User
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Contact User
                </Button>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
