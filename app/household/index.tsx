import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { BrandHeader } from "@/components/common/BrandHeader";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function HouseholdDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Household dashboard" showLogout />
      <Text style={styles.subtitle}>Stay on top of every pickup with a calm, clear view of your requests.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Quick actions</Text>
        <Button title="Request pickup" fullWidth onPress={() => router.push("/household/request-pickup")} />
        <Button title="Track active request" fullWidth variant="secondary" onPress={() => router.push("/household/track-request")} />
        <Button title="Pickup history" fullWidth variant="ghost" onPress={() => router.push("/household/history")} />
        <Button title="My profile" fullWidth variant="ghost" onPress={() => router.push("/household/profile")} />
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
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { gap: 10 },
  cardTitle: { ...typography.title, marginBottom: 4 },
  body: { ...typography.body, color: colors.muted },
});
