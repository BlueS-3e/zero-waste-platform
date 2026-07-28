import { getSupabaseClientOrThrow } from "@/services/supabase";
import type { CollectorProfile } from "./types";

export async function getCollectors(): Promise<CollectorProfile[]> {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase.from("profiles").select("*").eq("role", "collector");
  if (error) throw error;
  return (data ?? []) as CollectorProfile[];
}
