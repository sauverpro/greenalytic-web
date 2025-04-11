import React from "react";

interface Vehicle {
  id: number;
  plateNumber: string;
}

interface VehicleSelectProps {
  vehicles: Vehicle[];
  selectedVehicleId: number | null;
  onSelect: (id: number) => void;
}

const VehicleSelector: React.FC<VehicleSelectProps> = ({
  vehicles,
  selectedVehicleId,
  onSelect,
}) => {
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    onSelect(newId);
  };

  return (
    <div className="items-center mb-4">
      <label className="font-bold text-lg text-sms">
        Select Vehicle: </label>
      <select
        className="ml-2 p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selectedVehicleId || ""}
        onChange={handleVehicleChange}
      >
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id} className="text-sms">
            {vehicle.plateNumber}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VehicleSelector;
