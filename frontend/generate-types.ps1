class EmissionData {
  [int]$id
  [DateTime]$timestamp
  [float]$co2Percentage
  [float]$coPercentage
  [float]$o2Percentage
  [int]$hcPPM
  [int]$vehicleId
  [string]$plateNumber
  [int]$trackingDeviceId
  [DateTime]$createdAt
}

class GPSData {
  [int]$id
  [float]$latitude
  [float]$longitude
  [string]$plateNumber
  [float]$speed
  [float]$accuracy
  [DateTime]$timestamp
  [int]$vehicleId
  [bool]$trackingStatus
  [int]$trackingDeviceId
  [DateTime]$createdAt
  [DateTime]$updatedAt
}

class FuelData {
  [int]$id
  [DateTime]$timestamp
  [float]$fuelLevel
  [float]$fuelConsumption
  [string]$plateNumber
  [int]$trackingDeviceId
  [int]$vehicleId
  [DateTime]$createdAt
  [DateTime]$updatedAt
}

class Vehicle {
  [int]$id
  [string]$plateNumber
  [string]$chassisNumber
  [string]$vehicleType
  [string]$vehicleModel
  [int]$yearOfManufacture
  [string]$usage
  [int]$userId
  [EmissionData[]]$emissionDatas
  [GPSData[]]$gpsDatas
  [FuelData[]]$fuelDatas
  [DateTime]$createdAt
  [DateTime]$updatedAt
  [DateTime]$deletedAt
  [TrackingDevice]$trackingDevice
}

class TrackingDevice {
  [int]$id
  [string]$serialNumber
  [string]$model
  [string]$type
  [string]$plateNumber
  [bool]$isActive
  [DateTime]$lastPing
  [GPSData[]]$gpsDatas
  [FuelData[]]$fuelDatas
  [EmissionData[]]$emissionDatas
  [int]$userId
  [int]$vehicleId
  [DateTime]$createdAt
  [DateTime]$updatedAt
  [DateTime]$deletedAt
}

class User {
  [int]$id
  [string]$username
  [string]$email
  [string]$image
  [string]$password
  [string]$gender
  [string]$role
  [DateTime]$otpExpiresAt
  [string]$otp
  [string]$token
  [bool]$verified
  [string]$phoneNumber
  [DateTime]$deletedAt
  [DateTime]$createdAt
  [DateTime]$updatedAt
  [Vehicle[]]$vehicles
  [TrackingDevice[]]$trackingDevices
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  chassisNumber?: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: number;
  usage: string;
  userId: number;
  emissionDatas: EmissionData[];
  gpsDatas: GPSData[];
  fuelDatas: FuelData[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  trackingDevice?: TrackingDevice;
}

export interface TrackingDevice {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  isActive: boolean;
  lastPing?: Date;
  gpsDatas: GPSData[];
  fuelDatas: FuelData[];
  emissionDatas: EmissionData[];
  userId?: number;
  vehicleId: number;
  createdAt: Date;
  updatedAt: Date;
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
  [string]$status
  lastUpdated: Date;
}
