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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // fullName is passed here so the DB trigger can extract it
      data: { fullName, role },
    },
  });
  if (error) throw error;

  // We no longer manually create the profile row here.
  // The Supabase 'on_auth_user_created' trigger handles it automatically.

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
