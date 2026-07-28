import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getRequestsByHousehold } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";

export default function TrackRequestScreen() {
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
      <Text style={styles.title}>Track request</Text>
      <Text style={styles.subtitle}>See the status of your active pickup request.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <Text style={styles.body}>Loading request status...</Text> : null}

      {request ? (
        <Card>
          <Text style={styles.cardTitle}>Status: {request.status}</Text>
          <Text style={styles.body}>Waste type: {request.waste_type}</Text>
          <Text style={styles.body}>Location: {request.location ?? "Not provided"}</Text>
          <Text style={styles.body}>Details: {request.description ?? "No details provided."}</Text>
        </Card>
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
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
