import "react-native-url-polyfill/auto";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function isValidHttpUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

function getWebExtraConfig() {
  const windowObj = typeof window !== "undefined" ? (window as any) : undefined;
  return windowObj?.__expoConfig?.extra
    ?? windowObj?.EXPO_CONFIG?.extra
    ?? windowObj?.__EXPO_CONFIG?.extra
    ?? undefined;
}

function isValidSupabaseAnonKey(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.length >= 32 && !["anon-key-placeholder", "your_supabase_anon_key"].includes(trimmed);
}

function resolveSupabaseConfig() {
  const extra = Constants.expoConfig?.extra ?? (Constants.manifest as any)?.extra ?? getWebExtraConfig() ?? {};
  const envSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const envSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const supabaseUrl = isValidHttpUrl(envSupabaseUrl)
    ? envSupabaseUrl.trim()
    : isValidHttpUrl(extra.supabaseUrl)
    ? extra.supabaseUrl.trim()
    : undefined;

  const supabaseAnonKey = isValidSupabaseAnonKey(envSupabaseAnonKey)
    ? envSupabaseAnonKey.trim()
    : isValidSupabaseAnonKey(extra.supabaseAnonKey)
    ? extra.supabaseAnonKey.trim()
    : undefined;

  return { supabaseUrl, supabaseAnonKey };
}

function getSupabaseAuthOptions() {
  const authOptions: Record<string, unknown> = {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  };

  if (Platform.OS !== "web") {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    authOptions.storage = AsyncStorage;
  }

  return authOptions;
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = resolveSupabaseConfig();

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: getSupabaseAuthOptions(),
    });
  }

  return supabaseClient;
}

export function getSupabaseClientOrThrow(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in environment variables or app.json extra."
    );
  }
  return client;
}
