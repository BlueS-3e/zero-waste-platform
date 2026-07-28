import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function HouseholdDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Household dashboard</Text>
      <Text style={styles.subtitle}>Manage pickups and keep track of your requests.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Quick actions</Text>
        <Button title="Request pickup" fullWidth onPress={() => router.push("/(household)/request-pickup")} />
        <Button title="Track request" fullWidth variant="secondary" onPress={() => router.push("/(household)/track-request")} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Recent activity</Text>
        <Text style={styles.body}>No requests yet. Create your first pickup to get started.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 4 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
