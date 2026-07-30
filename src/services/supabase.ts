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

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = normalized + (padding === 0 ? "" : "=".repeat(4 - padding));

  if (typeof atob === "function") {
    return atob(padded);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  return null;
}

function deriveSupabaseUrlFromAnonKey(value: unknown): string | undefined {
  if (!isValidSupabaseAnonKey(value)) {
    return undefined;
  }

  const segments = value.trim().split(".");
  if (segments.length !== 3) {
    return undefined;
  }

  const payload = decodeBase64Url(segments[1]);
  if (!payload) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(payload);
    if (parsed?.ref && typeof parsed.ref === "string") {
      return `https://${parsed.ref}.supabase.co`;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function resolveSupabaseConfig() {
  const extra = Constants.expoConfig?.extra ?? (Constants.manifest as any)?.extra ?? getWebExtraConfig() ?? {};
  const envSupabaseUrl = typeof process.env.EXPO_PUBLIC_SUPABASE_URL === "string"
    ? process.env.EXPO_PUBLIC_SUPABASE_URL.trim()
    : typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string"
    ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim()
    : undefined;
  const envSupabaseAnonKey = typeof process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY === "string"
    ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.trim()
    : typeof process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY === "string"
    ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim()
    : undefined;
  const extraSupabaseUrl = typeof extra.supabaseUrl === "string"
    ? extra.supabaseUrl.trim()
    : typeof extra.nextSupabaseUrl === "string"
    ? extra.nextSupabaseUrl.trim()
    : undefined;
  const extraSupabaseAnonKey = typeof extra.supabaseAnonKey === "string"
    ? extra.supabaseAnonKey.trim()
    : typeof extra.supabasePublishableKey === "string"
    ? extra.supabasePublishableKey.trim()
    : typeof extra.nextSupabasePublishableKey === "string"
    ? extra.nextSupabasePublishableKey.trim()
    : undefined;

  const supabaseUrl = isValidHttpUrl(envSupabaseUrl)
    ? envSupabaseUrl
    : isValidHttpUrl(extraSupabaseUrl)
    ? extraSupabaseUrl
    : deriveSupabaseUrlFromAnonKey(envSupabaseAnonKey)
    ?? deriveSupabaseUrlFromAnonKey(extraSupabaseAnonKey);

  const supabaseAnonKey = isValidSupabaseAnonKey(envSupabaseAnonKey)
    ? envSupabaseAnonKey
    : isValidSupabaseAnonKey(extraSupabaseAnonKey)
    ? extraSupabaseAnonKey
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
