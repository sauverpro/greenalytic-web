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


export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
  includeDeleted?: boolean;
  deletedOnly?: boolean;
}

export interface UserCreateDTO {
  email: string;
  username: string;

  phoneNumber: string;
  nationalId: string;
  gender: string;
  location: string;
  companyName: string;
  companyRegistrationNumber: string;
  businessSector: string;
  fleetSize: number;
  language?: string;
  notificationPreference?: string;
  role: UserRole;
  status: UserStatus;
}
export interface UserUpdateDTO {
  email: string;
  username: string;
  phoneNumber: string;
  nationalId: string;
  gender: string;
  location: string;
  companyName: string;
  companyRegistrationNumber: string;
  businessSector: string;
  fleetSize:number;
  language?: string;
  notificationPreference?: string;
  role: UserRole;
  status: UserStatus;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}
export interface LoginDTO {
  email: string;
  password: string;
}
export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
export interface RequestPasswordResetDTO {
  email: string;
}
export interface ChangeRoleDTO {
  role: UserRole;
}
export interface ChangeRoleDTO {
  role: UserRole;
}
export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}
export interface User {
  id: number;
  username?: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  companyName?: string;
  role: UserRole;
  status: UserStatus;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  registrationNumber?: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: number;
  status: string;
  emissionStatus: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingDevice {
  id: number;
  serialNumber: string;
  model: string;
  type: string;
  plateNumber: string;
  status: string;
  deviceCategory: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: number;
  type: string;
  title: string;
  isRead: boolean;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  nationalId?: string;
  gender?: string;
  phoneNumber?: string;
  location?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  businessSector?: string;
  fleetSize?: number;
  language?: string;
  notificationPreference?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


export interface GetUserByIdResponse {
  id: number;
  username?: string;
  email: string;
  image?: string;
  companyRegistrationNumber: string;
  nationalId: string;
  businessSector: string;
  gender?: string;
  phoneNumber?: string;
  companyName?: string;
  fleetSize: number;
  language: string;
  role: UserRole;
  notificationPreference: string;
  status: UserStatus;
  location?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    vehicles: number;
    trackingDevices: number;
    alerts: number;
    reports: number;
    activityLogs: number;
    userNotifications: number;
  };
  vehicles: Array<{
    id: number;
    plateNumber: string;
    vehicleModel: string;
    status: string;
    emissionStatus: string;
  }>;
  trackingDevices: Array<{
    id: number;
    serialNumber: string;
    model: string;
    deviceCategory: string;
    status: string;
  }>;
  alerts: Array<{
    id: number;
    type: string;
    title: string;
    isRead: boolean;
    createdAt: Date;
  }>;
}
