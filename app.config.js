const path = require('path');

function loadDotenv() {
  try {
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '.env') });
  } catch {
    // No dotenv available in this environment.
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlaceholderValue(value) {
  return [
    'https://example.supabase.co',
    'anon-key-placeholder',
    'your_supabase_project_url',
    'your_supabase_anon_key',
    'your_google_maps_key',
  ].includes(value);
}

loadDotenv();

module.exports = ({ config }) => {
  const envSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const envSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const envGoogleMapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY?.trim();

  // Supabase Configuration
  const supabaseUrl = isNonEmptyString(envSupabaseUrl)
    ? envSupabaseUrl
    : isNonEmptyString(config.extra?.supabaseUrl) && !isPlaceholderValue(config.extra.supabaseUrl)
    ? config.extra.supabaseUrl
    : undefined;

  const supabaseAnonKey = isNonEmptyString(envSupabaseAnonKey)
    ? envSupabaseAnonKey
    : isNonEmptyString(config.extra?.supabaseAnonKey) && !isPlaceholderValue(config.extra.supabaseAnonKey)
    ? config.extra.supabaseAnonKey
    : undefined;

  // Google Maps Configuration
  const googleMapsKey = isNonEmptyString(envGoogleMapsKey) && !isPlaceholderValue(envGoogleMapsKey)
    ? envGoogleMapsKey
    : undefined;

  const extra = { ...(config.extra ?? {}) };
  delete extra.supabaseUrl;
  delete extra.supabaseAnonKey;

  return {
    ...config,
    ios: {
      ...config.ios,
      bundleIdentifier: 'com.bolar.zerowaste',
      config: {
        ...config.ios?.config,
        googleMapsApiKey: googleMapsKey,
      },
    },
    android: {
      ...config.android,
      package: 'com.bolar.zerowaste',
      config: {
        ...config.android?.config,
        googleMaps: {
          ...config.android?.config?.googleMaps,
          apiKey: googleMapsKey,
        },
      },
    },
    extra: {
      ...extra,
      ...(supabaseUrl ? { supabaseUrl } : {}),
      ...(supabaseAnonKey ? { supabaseAnonKey } : {}),
      ...(googleMapsKey ? { googleMapsKey } : {}), // Also make available to JS if needed
    },
  };
};
