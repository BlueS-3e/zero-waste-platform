import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getRequestsByHousehold } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";

import { BrandHeader } from "@/components/common/BrandHeader";

export default function TrackRequestScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState<WasteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
      const requests = await getRequestsByHousehold(user.id);
      setRequest(requests[0] ?? null);
    } catch (err: any) {
      setError(err.message || "Unable to load request status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [user]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Track request" showLogout showBack />
      <Text style={styles.subtitle}>Follow your pickup journey and see exactly where things stand.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}

      {request ? (
        <>
          <Card>
            <View style={styles.statusRow}>
              <Text style={styles.cardTitle}>{request.waste_type} pickup</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>
            <Text style={styles.body}>Location: {request.address ?? "Not provided"}</Text>
            <Text style={styles.body}>Details: {request.description ?? "No details provided."}</Text>
          </Card>

          {request.location_lat != null && request.location_lng != null ? (
            <Card style={styles.mapCard}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: request.location_lat,
                  longitude: request.location_lng,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.015,
                }}
              >
                <Marker
                  coordinate={{ latitude: request.location_lat, longitude: request.location_lng }}
                  title="Your Location"
                  pinColor={colors.primary}
                />
                {request.collector_id && (
                  <Marker
                    coordinate={{
                      latitude: request.location_lat + 0.002,
                      longitude: request.location_lng + 0.002,
                    }}
                    title="Collector"
                    pinColor={colors.secondary}
                  />
                )}
              </MapView>
            </Card>
          ) : null}
          <Button title="Pay now" fullWidth variant="primary" onPress={() => router.push("/household/payment")} />
        </>
      ) : !loading ? (
        <Card>
          <Text style={styles.cardTitle}>No active request</Text>
          <Text style={styles.body}>Make a pickup request to see the tracking status here.</Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  error: { color: "#c62828", marginBottom: 8 },
  mapCard: { padding: 0, overflow: "hidden", borderRadius: 16, marginTop: 4 },
  map: { width: "100%", height: 260 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statusBadge: { backgroundColor: colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  statusText: { fontSize: 12, fontWeight: "700", color: colors.primary, textTransform: "uppercase" },
});
