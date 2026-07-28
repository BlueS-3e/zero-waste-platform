import { getSupabaseClientOrThrow } from "@/services/supabase";
import type { Profile, SignInPayload, SignUpPayload } from "./types";

export async function signIn({ email, password }: SignInPayload) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp({ fullName, email, password, role }: SignUpPayload) {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    });

    if (profileError) throw profileError;
  }

  return data;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClientOrThrow();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function signOut() {
  const supabase = getSupabaseClientOrThrow();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
