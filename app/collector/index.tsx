import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { BrandHeader } from "@/components/common/BrandHeader";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function CollectorDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Collector dashboard" showLogout />
      <Text style={styles.subtitle}>See fresh opportunities and keep your pickup flow moving smoothly.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>My operations</Text>
        <Button title="Available requests" fullWidth onPress={() => router.push("/collector/available-requests")} />
        <Button title="Active job" fullWidth variant="secondary" onPress={() => router.push("/collector/active-job")} />
        <Button title="My earnings" fullWidth variant="ghost" onPress={() => router.push("/collector/earnings")} />
        <Button title="Profile settings" fullWidth variant="ghost" onPress={() => router.push("/collector/profile")} />
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
});
