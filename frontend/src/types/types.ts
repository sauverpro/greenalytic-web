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
export interface IUpdateVehicle {
  id?: number;
  plateNumber?: string;
  chassisNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  yearOfManufacture?: number;
  usage?: string;
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

export interface IUpdateTrackingDevice {
  id: number; 
  serialNumber?: string;
  model?: string;
  type?: string;
  plateNumber?: string;
  isActive?: boolean;
  status?: string;
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


export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  TECHNICIAN = "TECHNICIAN",
  MANAGER = "MANAGER",
  FLEET_MANAGER = "FLEET_MANAGER",
  ANALYST = "ANALYST",
  SUPPORT_AGENT = "SUPPORT_AGENT",
}

export enum ConnectionStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

export enum DeviceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  DISCONNECTED = "DISCONNECTED",
  MAINTENANCE = "MAINTENANCE",
}

export enum VehicleStatus {
  NORMAL_EMISSION = "NORMAL_EMISSION",
  TOP_POLLUTING = "TOP_POLLUTING",
  INACTIVE_DISCONNECTED = "INACTIVE_DISCONNECTED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
}

export enum EmissionStatus {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

export enum FuelType {
  PETROL = "PETROL",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
}

export enum DeviceCategory {
  MOTORCYCLE = "MOTORCYCLE",
  CAR = "CAR",
  TRUCK = "TRUCK",
  TRICYCLE = "TRICYCLE",
  OTHER = "OTHER",
}

export enum CommunicationProtocol {
  MQTT = "MQTT",
  HTTP = "HTTP",
  SMS = "SMS",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  SUSPENDED = "SUSPENDED",
  DEACTIVATED = "DEACTIVATED",
}

export enum NotificationType {
  HIGH_EMISSION_ALERT = "HIGH_EMISSION_ALERT",
  DIAGNOSTIC_FAULT_NOTIFICATION = "DIAGNOSTIC_FAULT_NOTIFICATION",
  FUEL_ANOMALY_ALERT = "FUEL_ANOMALY_ALERT",
  DEVICE_OFFLINE_WARNING = "DEVICE_OFFLINE_WARNING",
  SPEED_VIOLATION_ALERT = "SPEED_VIOLATION_ALERT",
}
