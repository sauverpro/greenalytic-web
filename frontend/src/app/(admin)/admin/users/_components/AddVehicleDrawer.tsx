// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { addVehicleToUser } from "../../../../services/vehicleService";

// export default function AddVehicleDrawer({
//   open,
//   onOpenChange,
//   userId,
//   refetchVehicles,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   userId: string;
//   refetchVehicles: () => void;
// }) {
//   const [vehicleData, setVehicleData] = useState({
//     plateNumber: "",
//     chassisNumber: "",
//     vehicleType: "",
//     vehicleModel: "",
//     yearOfManufacture: 0,
//     usage: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setVehicleData((prev) => ({
//       ...prev,
//       [name]: name === "yearOfManufacture" ? parseInt(value, 10) || 0 : value, // Convert to number
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await addVehicleToUser(userId, vehicleData);
//       refetchVehicles();
//       onOpenChange(false); // Close drawer after adding vehicle
//     } catch (error) {
//       console.error("Failed to add vehicle", error);
//     }
//   };

//   return (
//     <Drawer open={open} onOpenChange={onOpenChange} direction="right">
//       <DrawerContent className="right-0 left-auto h-full w-full sm:w-96 flex flex-col">
//         <div className="mx-auto w-full max-w-sm">
//           <DrawerHeader>
//             <DrawerTitle>Add Vehicle to User</DrawerTitle>
//             <DrawerDescription>
//               Enter the vehicle details below.
//             </DrawerDescription>
//           </DrawerHeader>

//           {/* Form Inputs */}
//           <div className="p-4 pb-0 space-y-4">
//             <input
//               type="text"
//               name="plateNumber"
//               value={vehicleData.plateNumber}
//               onChange={handleInputChange}
//               placeholder="Plate Number"
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="chassisNumber"
//               value={vehicleData.chassisNumber}
//               onChange={handleInputChange}
//               placeholder="Chassis Number"
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="vehicleType"
//               value={vehicleData.vehicleType}
//               onChange={handleInputChange}
//               placeholder="Vehicle Type"
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="vehicleModel"
//               value={vehicleData.vehicleModel}
//               onChange={handleInputChange}
//               placeholder="Vehicle Model"
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="number"
//               name="yearOfManufacture"
//               value={vehicleData.yearOfManufacture || ""}
//               onChange={handleInputChange}
//               placeholder="Year of Manufacture"
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="usage"
//               value={vehicleData.usage}
//               onChange={handleInputChange}
//               placeholder="Usage"
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           {/* Drawer Footer */}
//           <DrawerFooter>
//             <Button onClick={handleSubmit}>Add Vehicle</Button>
//             <DrawerClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DrawerClose>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
