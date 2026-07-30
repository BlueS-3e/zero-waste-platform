export type WasteRequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

export type WasteRequest = {
  id: string;
  household_id?: string;
  collector_id?: string;
  waste_type: string;
  description?: string;
  // human readable address
  address?: string;
  // human readable address or pickup location
  location?: string;
  // optional latitude / longitude for maps
  location_lat?: number | null;
  location_lng?: number | null;
  status: WasteRequestStatus;
  created_at?: string;
};

export type CreateRequestPayload = {
  household_id?: string;
  collector_id?: string;
  waste_type: string;
  description?: string;
  address?: string;
  // human readable address or pickup location
  location?: string;
  location_lat?: number | null;
  location_lng?: number | null;
  status?: WasteRequestStatus;
};
