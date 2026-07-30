import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getActiveRequestForCollector, updateRequestStatus } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";

import { BrandHeader } from "@/components/common/BrandHeader";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function ActiveJobScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState<WasteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveJob = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
      const data = await getActiveRequestForCollector(user.id);
      setActiveRequest(data);
    } catch (err: any) {
      setError(err.message || "Unable to load active job.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveJob();
  }, [user]);

  const handleComplete = async () => {
    if (!activeRequest) return;
    setError(null);

    try {
      await updateRequestStatus(activeRequest.id, "completed");
      Alert.alert("Success", "Job marked as completed. Well done!");
      setActiveRequest(null);
    } catch (err: any) {
      setError(err.message || "Unable to complete the job.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Active job" showLogout showBack />
      <Text style={styles.subtitle}>Keep your current pickup on track with the latest details at hand.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}

      {activeRequest ? (
        <>
          <Card>
            <Text style={styles.cardTitle}>{activeRequest.waste_type} pickup</Text>
            <Text style={styles.body}>Location: {activeRequest.address ?? "Not specified"}</Text>
            <Text style={styles.body}>Details: {activeRequest.description ?? "No additional details."}</Text>
            <Text style={styles.body}>Status: {activeRequest.status}</Text>
          </Card>

          {activeRequest.location_lat != null && activeRequest.location_lng != null ? (
            <Card style={styles.mapCard}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: activeRequest.location_lat,
                  longitude: activeRequest.location_lng,
                  latitudeDelta: 0.012,
                  longitudeDelta: 0.012,
                }}
              >
                <Marker
                  coordinate={{ latitude: activeRequest.location_lat, longitude: activeRequest.location_lng }}
                  title="Pickup Location"
                  pinColor={colors.primary}
                />
              </MapView>
            </Card>
          ) : null}

          <Button title="Mark job completed" fullWidth onPress={handleComplete} />
        </>
      ) : !loading ? (
        <Card>
          <Text style={styles.cardTitle}>No active job found</Text>
          <Text style={styles.body}>Accept a pickup in the available requests screen to get started.</Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  error: { color: "#c62828", marginBottom: 8 },
  mapCard: { padding: 0, overflow: "hidden", borderRadius: 16, marginTop: 4 },
  map: { width: "100%", height: 260 },
});
