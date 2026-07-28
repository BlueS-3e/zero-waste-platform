import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function CollectorDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Collector dashboard</Text>
      <Text style={styles.subtitle}>Review opportunities and manage active jobs.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Ready to work?</Text>
        <Button title="View available requests" fullWidth onPress={() => router.push("/(collector)/available-requests")} />
        <Button title="Open active job" fullWidth variant="secondary" onPress={() => router.push("/(collector)/active-job")} />
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
});
