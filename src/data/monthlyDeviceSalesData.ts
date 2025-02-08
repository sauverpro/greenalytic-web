// src/data/mockData.ts

export const monthlyDeviceSalesData = [
  { month: "January", deviceA: 50, deviceB: 40, deviceC: 30 },
  { month: "February", deviceA: 60, deviceB: 45, deviceC: 35 },
  { month: "March", deviceA: 55, deviceB: 50, deviceC: 40 },
  { month: "April", deviceA: 70, deviceB: 60, deviceC: 50 },
  { month: "May", deviceA: 80, deviceB: 70, deviceC: 60 },
  { month: "June", deviceA: 90, deviceB: 80, deviceC: 70 },
  { month: "July", deviceA: 100, deviceB: 90, deviceC: 80 },
  { month: "August", deviceA: 110, deviceB: 95, deviceC: 85 },
  { month: "September", deviceA: 120, deviceB: 100, deviceC: 90 },
  { month: "October", deviceA: 130, deviceB: 110, deviceC: 100 },
  { month: "November", deviceA: 140, deviceB: 120, deviceC: 110 },
  { month: "December", deviceA: 150, deviceB: 130, deviceC: 120 }
];

export const chartConfig = {
  deviceA: {
    label: "Device A",
    color: "#FF5733" // Red color for Device A
  },
  deviceB: {
    label: "Device B",
    color: "#33FF57" // Green color for Device B
  },
  deviceC: {
    label: "Device C",
    color: "#3357FF" // Blue color for Device C
  }
};

export const carSalesData = [

    { month: "January", sedan: 150, suv: 120, truck: 100 },
    { month: "February", sedan: 180, suv: 140, truck: 110 },
    { month: "March", sedan: 210, suv: 160, truck: 130 },
    { month: "April", sedan: 160, suv: 130, truck: 140 },
    { month: "May", sedan: 200, suv: 180, truck: 150 },
    { month: "June", sedan: 220, suv: 190, truck: 170 }
];

export const carSalesConfig = {
  
  sedan: { label: "Sedan", color: "#2563eb" },
  suv: { label: "SUV", color: "#60a5fa" },
  truck: { label: "Truck", color: "#f87171" }
};

export const weeklySalesData = [
  { name: "Smartphones", value: 120, fill: "#2563eb" }, // Blue
  { name: "Laptops", value: 90, fill: "#60a5fa" }, // Light Blue
  { name: "Tablets", value: 60, fill: "#a3e635" } // Green
];

export const weeklyClientsData = [
  { name: "Sedan", value: 80, fill: "#f87171" }, // Red
  { name: "SUV", value: 110, fill: "#facc15" }, // Yellow
  { name: "Truck", value: 50, fill: "#34d399" } // Green
];

 export const dailySalesData = [
  { day: "Mon", smartphones: 15, laptops: 10, tablets: 8 },
  { day: "Tue", smartphones: 20, laptops: 12, tablets: 6 },
  { day: "Wed", smartphones: 18, laptops: 15, tablets: 7 },
  { day: "Thu", smartphones: 25, laptops: 14, tablets: 10 },
  { day: "Fri", smartphones: 22, laptops: 16, tablets: 12 },
  { day: "Sat", smartphones: 30, laptops: 20, tablets: 15 },
  { day: "Sun", smartphones: 28, laptops: 18, tablets: 13 }
];

export const dailySalesConfig = {
  smartphones: { label: "Smartphones", color: "#2563eb" }, // Blue
  laptops: { label: "Laptops", color: "#60a5fa" }, // Light Blue
  tablets: { label: "Tablets", color: "#a3e635" } // Green
};
