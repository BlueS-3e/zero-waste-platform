// CRUD + realtime subscription for waste_requests table
import { getSupabaseClientOrThrow } from "./supabase";

export async function createRequest(payload: any) {
  const supabase = getSupabaseClientOrThrow();
  return supabase.from("waste_requests").insert(payload).select().single();
}

export async function getNearbyRequests() {
  const supabase = getSupabaseClientOrThrow();
  return supabase.from("waste_requests").select("*").eq("status", "pending");
}
