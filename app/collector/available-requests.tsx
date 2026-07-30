import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { acceptRequest, getPendingRequests } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";

import { BrandHeader } from "@/components/common/BrandHeader";

export default function AvailableRequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Unable to load available requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    if (!user) return;
    setError(null);

    try {
      await acceptRequest(requestId, user.id);
      setRequests((current) => current.filter((request) => request.id !== requestId));
    } catch (err: any) {
      setError(err.message || "Unable to accept request.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Available requests" showLogout showBack />
      <Text style={styles.subtitle}>Fresh pickup opportunities are waiting for your next trip.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}

      {requests.length === 0 && !loading ? (
        <Card>
          <Text style={styles.cardTitle}>No pending requests</Text>
          <Text style={styles.body}>There are no new pickup requests available right now.</Text>
        </Card>
      ) : null}

      {requests.map((request) => (
        <Card key={request.id} style={styles.card}>
          <View style={styles.requestRow}>
            <Text style={styles.cardTitle}>{request.waste_type} pickup</Text>
            <Text style={styles.status}>{request.status}</Text>
          </View>
          <Text style={styles.body}>{request.address ?? "Location not provided"}</Text>
          <Text style={styles.body}>{request.description ?? "No additional details."}</Text>
          <Button title="Accept request" fullWidth onPress={() => handleAccept(request.id)} />
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 8 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  requestRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  status: { color: colors.primary, fontWeight: "700", textTransform: "capitalize" },
  error: { color: "#c62828", marginBottom: 8 },
});
