import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getActiveRequestForCollector, updateRequestStatus } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";

export default function ActiveJobScreen() {
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
      setActiveRequest(null);
    } catch (err: any) {
      setError(err.message || "Unable to complete the job.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Active job</Text>
      <Text style={styles.subtitle}>Details for the pickup currently in progress.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <Text style={styles.body}>Loading your active job...</Text> : null}

      {activeRequest ? (
        <Card>
          <Text style={styles.cardTitle}>{activeRequest.waste_type} pickup</Text>
          <Text style={styles.body}>Location: {activeRequest.location ?? "Not specified"}</Text>
          <Text style={styles.body}>Details: {activeRequest.description ?? "No additional details."}</Text>
          <Text style={styles.body}>Status: {activeRequest.status}</Text>
          <Button title="Mark job completed" fullWidth onPress={handleComplete} />
        </Card>
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
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  error: { color: "#c62828", marginBottom: 8 },
});
