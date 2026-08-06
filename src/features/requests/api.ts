import { getSupabaseClientOrThrow } from "@/services/supabase";
import type { CreateRequestPayload, WasteRequest, WasteRequestStatus } from "./types";

export async function createRequest(payload: CreateRequestPayload) {
  const request = {
    ...payload,
    status: payload.status ?? "pending",
  };

  const supabase = getSupabaseClientOrThrow();
  // map our frontend fields to DB columns
  const dbRow: any = {
    household_id: request.household_id,
    collector_id: request.collector_id,
    status: request.status,
    waste_type: request.waste_type,
    address: request.address ?? null,
    location_lat: request.location_lat ?? null,
    location_lng: request.location_lng ?? null,
    description: request.description ?? null,
    phone: request.phone ?? null,
  };

  const { data, error } = await supabase.from("waste_requests").insert(dbRow).select().single();
  if (error) throw error;
  return data as WasteRequest;
}

export async function getRequests() {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase.from("waste_requests").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as WasteRequest[];
}

export async function getPendingRequests() {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as WasteRequest[];
}

export async function getRequestsByHousehold(householdId: string) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as WasteRequest[];
}

export async function getActiveRequestForCollector(collectorId: string) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .select("*")
    .eq("collector_id", collectorId)
    .in("status", ["accepted", "in_progress", "collected"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as WasteRequest | null;
}

export async function acceptRequest(requestId: string, collectorId: string) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .update({ collector_id: collectorId, status: "accepted" })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data as WasteRequest;
}

export async function updateRequestStatus(requestId: string, status: WasteRequestStatus) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .update({ status })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data as WasteRequest;
}

/**
 * Finalizes a job by confirming payment was received.
 */
export async function confirmPayment(requestId: string) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .update({ status: "completed" })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data as WasteRequest;
}

/**
 * Releases a request back to the pending pool.
 * Used when a collector can no longer fulfill an accepted job.
 */
export async function declineRequest(requestId: string) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("waste_requests")
    .update({
      collector_id: null,
      status: "pending"
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data as WasteRequest;
}
