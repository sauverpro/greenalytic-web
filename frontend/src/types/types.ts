export interface User {
  id: number;
  username?: string;
  email: string;
  image?: string;
  gender?: string;
  password?: string;
  role: "ADMIN" | "USER" | "TECHNICIAN" | "MANAGER";
  phoneNumber?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  vehicles: Vehicle[];
  trackingDevices: TrackingDevice[];
}

export interface Vehicle {
  id?: number;
  plateNumber: string;
  chassisNumber?: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: number;
  usage: string;
  userId?: number;
  emissionDatas?: EmissionData[];
  gpsDatas?: GPSData[];
  fuelDatas?: FuelData[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  trackingDevice?: TrackingDevice;
}

export interface TrackingDevice {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  isActive?: boolean;
  lastPing?: Date;
  gpsDatas?: GPSData[];
  fuelDatas?: FuelData[];
  emissionDatas?: EmissionData[];
  userId?: number;
  email?: string;
  username?: string;
  vehicleId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FuelData {
  id: number;
  timestamp: Date;
  fuelLevel: number;
  fuelConsumption: number;
  plateNumber: string;
  trackingDeviceId: number;
  vehicleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmissionData {
  id: number;
  timestamp: Date;
  co2Percentage: number;
  coPercentage: number;
  o2Percentage: number;
  hcPPM: number;
  vehicleId: number;
  plateNumber: string;
  trackingDeviceId: number;
  createdAt: Date;
}

export interface GPSData {
  id: number;
  latitude: number;
  longitude: number;
  plateNumber: string;
  speed: number;
  accuracy?: number;
  timestamp: Date;
  vehicleId: number;
  trackingStatus: boolean;
  trackingDeviceId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionState {
  id: number;
  vehicleId: string;
  socketId: string;
  status: "CONNECTED" | "DISCONNECTED";
  lastUpdated: Date;
}




export interface ClientDevice {
  gps: number;
  fuel: number;
  emissions: number;
}

export interface ClientBillingInfo {
  plan: string;
  nextBilling: string;
  amount: string;
  paymentMethod: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  address: string;
  status: string;
  joinDate: string;
  subscription: string;
  vehicles: number;
  devices: ClientDevice;
  contactPerson: string;
  contactRole: string;
  contactEmail: string;
  GPSDevices: string;
  fuelDevices: string;
  emissionsDevices: string;
  totalDevices: string;
  totalGPS: string;
  totalFuel: string;
  totalEmissions: string;
  contactPhone: string;
  billingInfo: ClientBillingInfo;
}

export interface VehicleData {
  id: string;
  plate: string;
  model: string;
  year: string;
  status: string;
  plateNumber: string;
  devices: string[];
}

export interface DeviceData {
  id: string;
  type: string;
  vehicle: string;
  date: string;
  status: string;
  lastPing: string;
}

