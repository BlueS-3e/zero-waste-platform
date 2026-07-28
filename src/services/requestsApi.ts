// CRUD + realtime subscription for waste_requests table
// createRequest(), getNearbyRequests(collectorLocation), acceptRequest(id, collectorId),
// updateRequestStatus(id, status), subscribeToRequests(callback)
import { supabase } from "./supabase";

export async function createRequest(payload: any) {
  return supabase.from("waste_requests").insert(payload).select().single();
}

export async function getNearbyRequests() {
  return supabase.from("waste_requests").select("*").eq("status", "pending");
}
