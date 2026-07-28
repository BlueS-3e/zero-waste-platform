export type UserRole = "household" | "collector" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string;
  location_lat?: number;
  location_lng?: number;
}

export type RequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

export interface WasteRequest {
  id: string;
  household_id: string;
  collector_id?: string;
  status: RequestStatus;
  waste_type: string;
  location_lat: number;
  location_lng: number;
  address: string;
  created_at: string;
  scheduled_at?: string;
}
