export type WasteRequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

export type WasteRequest = {
  id: string;
  household_id?: string;
  collector_id?: string;
  waste_type: string;
  description?: string;
  location?: string;
  status: WasteRequestStatus;
  created_at?: string;
};

export type CreateRequestPayload = {
  household_id?: string;
  collector_id?: string;
  waste_type: string;
  description?: string;
  location?: string;
  status?: WasteRequestStatus;
};
