import { useState } from "react";
import { addVehicleToUser } from "@/api/services/vehicleService";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/types";

const VehicleForm = ({
  userId,
  onSubmit
}: {
  userId: string;
  onSubmit: () => void;
}) => {
  const [vehicleData, setVehicleData] = useState<Vehicle>({
    id: 0,
    userId: Number(userId) || 0,
    plateNumber: "",
    chassisNumber: undefined,
    vehicleType: "",
    vehicleModel: "",
    yearOfManufacture: 0,
    usage: "",
    emissionDatas: [],
    gpsDatas: [],
    fuelDatas: [],
    trackingDevice: undefined,
    deletedAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]:
        name === "yearOfManufacture" ? Number(value) || 0 : value || undefined
    }));
  };

  const handleSubmit = async () => {
    try {
      await addVehicleToUser(userId, vehicleData);
      onSubmit();
    } catch (error) {
      console.error("Failed to add vehicle", error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold mb-4">Add Vehicle</h2>
      <div className="space-y-4">
        {[
          { name: "plateNumber", label: "Plate Number", type: "text" },
          { name: "chassisNumber", label: "Chassis Number", type: "text" },
          { name: "vehicleType", label: "Vehicle Type", type: "text" },
          { name: "vehicleModel", label: "Vehicle Model", type: "text" },
          {
            name: "yearOfManufacture",
            label: "Year of Manufacture",
            type: "number"
          },
          { name: "usage", label: "Usage", type: "text" }
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={
                vehicleData[field.name as keyof typeof vehicleData] as
                  | string
                  | number
              }
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <Button onClick={handleSubmit} className="w-full">
          Add Vehicle
        </Button>
      </div>
    </div>
  );
};
