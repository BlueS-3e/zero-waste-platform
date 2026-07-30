import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getRequestsByHousehold } from "@/features/requests/api";
import { submitRating } from "@/features/ratings/api";
import type { WasteRequest } from "@/features/requests/types";
import { BrandHeader } from "@/components/common/BrandHeader";

export default function RateCollectorScreen() {
  const { user } = useAuth();
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [request, setRequest] = useState<WasteRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const requests = await getRequestsByHousehold(user.id);
        // find most recent completed request
        const completed = requests.find((r) => r.status === "completed") ?? requests[0] ?? null;
        setRequest(completed);
      } catch {
        // ignore
      }
    };
    load();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !request || !request.collector_id) {
      Alert.alert("No collector to rate", "We couldn't find a completed pickup to rate.");
      return;
    }

    const numeric = parseInt(rating, 10);
    if (isNaN(numeric) || numeric < 1 || numeric > 5) {
      Alert.alert("Invalid rating", "Please enter a rating between 1 and 5.");
      return;
    }

    setLoading(true);
    try {
      await submitRating({
        request_id: request.id,
        household_id: user.id,
        collector_id: request.collector_id,
        rating: numeric,
        comment: note,
      });
      Alert.alert("Thanks!", "Your rating has been submitted.");
      setRating("");
      setNote("");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Unable to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Rate Collector" showLogout showBack />
      <Text style={styles.subtitle}>Leave feedback after a pickup.</Text>

      <Card style={styles.card}>
        <Input placeholder="Rating (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric" />
        <Input placeholder="Feedback" value={note} onChangeText={setNote} />
        <Button title={loading ? "Submitting..." : "Submit review"} onPress={handleSubmit} fullWidth disabled={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { gap: 8 },
});
