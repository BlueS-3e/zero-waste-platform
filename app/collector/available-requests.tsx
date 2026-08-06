import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { acceptRequest, getPendingRequests } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";
import { typography } from "@/theme/typography";

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
      // After accepting, take them to the active job screen to see navigation
      router.push("/collector/active-job");
    } catch (err: any) {
      setError(err.message || "Unable to accept request.");
    }
  };

  const handleSkip = (requestId: string) => {
    setRequests(current => current.filter(r => r.id !== requestId));
  };

  // Realistic mock earning calculation for demo
  const getMockEarning = (wasteType: string) => {
    const prices: Record<string, number> = {
      "Household": 25.00,
      "Plastic": 15.00,
      "Organic": 10.00,
      "Electronic": 50.00,
      "Bulk": 80.00
    };
    return prices[wasteType] || 20.00;
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Available requests" showLogout showBack />
      <Text style={styles.subtitle}>Choose your next task and see your potential earnings in GHS.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}

      {requests.length === 0 && !loading ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.cardTitle}>No pending requests</Text>
          <Text style={styles.body}>Check back soon for new opportunities.</Text>
        </Card>
      ) : null}

      {requests.map((request) => (
        <Card key={request.id} style={styles.card}>
          <View style={styles.requestRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{request.waste_type} Pickup</Text>
              <Text style={styles.locationText}>{request.address || "Area unknown"}</Text>
            </View>
            <View style={styles.earningBadge}>
              <Text style={styles.earningText}>₵{getMockEarning(request.waste_type).toFixed(2)}</Text>
            </View>
          </View>

          {request.description && (
            <Text style={styles.descriptionText} numberOfLines={2}>{request.description}</Text>
          )}

          <View style={{ gap: 8 }}>
            <Button title="Accept Job" fullWidth onPress={() => handleAccept(request.id)} />
            <Button title="Not Interested" fullWidth variant="ghost" onPress={() => handleSkip(request.id)} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 40, gap: 14 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface, gap: 12 },
  cardTitle: { ...typography.title, fontSize: 17 },
  body: { ...typography.body, color: colors.muted },
  locationText: { ...typography.label, color: colors.muted, marginTop: 2 },
  descriptionText: { ...typography.body, fontSize: 13, color: colors.text, opacity: 0.8 },
  requestRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  earningBadge: { backgroundColor: colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  earningText: { fontSize: 14, fontWeight: "800", color: colors.success },
  error: { color: colors.danger, marginBottom: 8, ...typography.body, textAlign: "center" },
  emptyCard: { alignItems: "center", padding: 24 },
});
