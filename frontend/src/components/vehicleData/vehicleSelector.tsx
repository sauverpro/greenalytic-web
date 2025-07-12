import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from
  "@/components/ui/command";
import { Button } from "@/components/ui/button";

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
  const [open, setOpen] = React.useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="items-center mb-4">
      <label className="font-bold text-lg text-sms mb-2 block">
        Select Vehicle:
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {selectedVehicle
              ? selectedVehicle.plateNumber
              : "Select vehicle..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search vehicle..." />
            <CommandList>
              <CommandEmpty>No vehicle found.</CommandEmpty>
              {vehicles.map((vehicle) => (
                <CommandItem
                  key={vehicle.id}
                  value={vehicle.plateNumber}
                  onSelect={() => {
                    onSelect(vehicle.id);
                    setOpen(false);
                  }}
                >
                  {vehicle.plateNumber}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default VehicleSelector;
