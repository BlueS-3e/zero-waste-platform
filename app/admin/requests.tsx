import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/authStore";
import { getRequests } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";
import { typography } from "@/theme/typography";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return colors.warning;
      case "accepted":
      case "in_progress": return colors.info;
      case "collected": return colors.secondary;
      case "completed": return colors.success;
      case "cancelled": return colors.danger;
      default: return colors.muted;
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Requests" showLogout showBack />
      <Text style={styles.subtitle}>Review incoming requests and monitor platform traffic.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Card>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : requests.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.cardTitle}>No requests</Text>
          <Text style={styles.body}>There are no pickup requests in the system yet.</Text>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id} style={styles.card}>
            <View style={styles.requestHeader}>
              <View>
                <Text style={styles.cardTitle}>{request.waste_type} pickup</Text>
                <Text style={styles.timestamp}>{request.created_at ? new Date(request.created_at).toLocaleString() : "Just now"}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>{request.status.replace('_', ' ')}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.value}>{request.address || "Not provided"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Contact Number:</Text>
                <Text style={styles.value}>{request.phone || "No phone provided"}</Text>
              </View>

              {request.description && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Note:</Text>
                  <Text style={styles.value}>{request.description}</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
              <Text style={styles.footerId}>H: {request.household_id?.slice(0, 8)}...</Text>
              <Text style={styles.footerId}>C: {request.collector_id ? `${request.collector_id.slice(0, 8)}...` : "Unassigned"}</Text>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 36, gap: 14 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface, gap: 12 },
  emptyCard: { alignItems: "center", padding: 24 },
  cardTitle: { ...typography.title, fontSize: 16 },
  timestamp: { fontSize: 11, color: colors.muted, marginTop: 2 },
  body: { ...typography.body, color: colors.muted },

  requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },

  infoSection: { gap: 8 },
  infoRow: { gap: 2 },
  label: { ...typography.label, fontSize: 11, color: colors.muted },
  value: { ...typography.body, fontSize: 13, color: colors.text, fontWeight: "600" },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  footerId: { fontSize: 10, color: colors.muted, fontFamily: "monospace" }
});
