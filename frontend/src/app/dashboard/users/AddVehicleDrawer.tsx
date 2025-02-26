import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { addVehicleToUser } from "@/services/vehicleService"; // Assuming this service is imported

export default function AddVehicleDrawer({
  userId,
  refetchVehicles
}: {
  userId: string;
  refetchVehicles: () => void;
}) {
  const [vehicleData, setVehicleData] = useState({
    id: 0,
    userId: parseInt(userId), // This should be passed in and set as the userId
    plateNumber: "",
    chassisNumber: "",
    vehicleType: "",
    vehicleModel: "",
    yearOfManufacture: 0,
    usage: "",
    emissionDatas: [], // Assuming empty arrays for now
    gpsDatas: [],
    fuelDatas: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await addVehicleToUser(userId, vehicleData); // Send userId and vehicleData
      refetchVehicles(); // Refresh vehicles list
    } catch (error) {
      console.error("Failed to add vehicle", error);
    }
  };

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <Button variant="outline">Add Vehicle</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="absolute inset-0 bg-black/40" />
        <Drawer.Content className="right-2 top-16 bottom-2 fixed  outline-none w-[310px] flex">
          <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px]">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-2 text-zinc-900">
                Add Vehicle to User
              </Drawer.Title>
              <div className="space-y-4">
                <input
                  type="text"
                  name="plateNumber"
                  value={vehicleData.plateNumber}
                  onChange={handleInputChange}
                  placeholder="Plate Number"
                />
                <input
                  type="text"
                  name="chassisNumber"
                  value={vehicleData.chassisNumber}
                  onChange={handleInputChange}
                  placeholder="Chassis Number"
                />
                <input
                  type="text"
                  name="vehicleType"
                  value={vehicleData.vehicleType}
                  onChange={handleInputChange}
                  placeholder="Vehicle Type"
                />
                <input
                  type="text"
                  name="vehicleModel"
                  value={vehicleData.vehicleModel}
                  onChange={handleInputChange}
                  placeholder="Vehicle Model"
                />
                <input
                  type="number"
                  name="yearOfManufacture"
                  value={vehicleData.yearOfManufacture}
                  onChange={handleInputChange}
                  placeholder="Year of Manufacture"
                />
                <input
                  type="text"
                  name="usage"
                  value={vehicleData.usage}
                  onChange={handleInputChange}
                  placeholder="Usage"
                />
                <Button onClick={handleSubmit}>Add Vehicle</Button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
