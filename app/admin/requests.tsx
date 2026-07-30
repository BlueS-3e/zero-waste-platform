import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/authStore";
import { getRequests } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";

import { BrandHeader } from "@/components/common/BrandHeader";

export default function AdminRequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getRequests();
        setRequests(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load requests.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Requests" showLogout showBack />
      <Text style={styles.subtitle}>Review incoming requests and keep operations moving smoothly.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Card>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <Text style={styles.cardTitle}>No requests</Text>
          <Text style={styles.body}>There are no pickup requests in the system yet.</Text>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id} style={styles.card}>
            <View style={styles.requestHeader}>
              <Text style={styles.cardTitle}>{request.waste_type} pickup</Text>
              <Text style={styles.status}>{request.status}</Text>
            </View>
            <Text style={styles.body}>Location: {request.address ?? "Not provided"}</Text>
            <Text style={styles.body}>Details: {request.description ?? "No details provided."}</Text>
            <Text style={styles.body}>Household ID: {request.household_id ?? "Unassigned"}</Text>
            <Text style={styles.body}>Collector ID: {request.collector_id ?? "Unassigned"}</Text>
          </Card>
        ))
      )}
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
  requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  status: { color: colors.primary, fontWeight: "700", textTransform: "capitalize" },
});
