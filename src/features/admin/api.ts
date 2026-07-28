import { getSupabaseClientOrThrow } from "@/services/supabase";
import type { AdminStats } from "./types";

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseClientOrThrow();
  const [{ count: households }, { count: collectors }, { count: pending }, { count: completed }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "household"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "collector"),
    supabase.from("waste_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("waste_requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
  ]);

  return {
    households: households ?? 0,
    collectors: collectors ?? 0,
    pendingRequests: pending ?? 0,
    completedRequests: completed ?? 0,
  };
}
