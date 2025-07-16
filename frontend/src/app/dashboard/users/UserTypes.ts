export interface UserBasicInfo {
  id: number;
  username?: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  companyName?: string;
  role:
    | "ADMIN"
    | "USER"
    | "TECHNICIAN"
    | "MANAGER"
    | "FLEET_MANAGER"
    | "ANALYST"
    | "SUPPORT_AGENT";
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "DEACTIVATED";
}
