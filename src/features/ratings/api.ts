import { getSupabaseClientOrThrow } from "@/services/supabase";

type SubmitRatingPayload = {
  request_id: string;
  household_id: string;
  collector_id: string;
  rating: number;
  comment?: string;
};

export async function submitRating(payload: SubmitRatingPayload) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase
    .from("ratings")
    .insert({
      request_id: payload.request_id,
      household_id: payload.household_id,
      collector_id: payload.collector_id,
      rating: payload.rating,
      comment: payload.comment ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRatingsForCollector(collectorId: string) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase.from("ratings").select("*").eq("collector_id", collectorId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
