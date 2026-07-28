import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function AdminAnalyticsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Track activity and platform trends.</Text>

      <Card>
        <Text style={styles.cardTitle}>Pickup volume</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricValue}>18</Text>
          <Text style={styles.metricLabel}>this week</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricValue}>14</Text>
          <Text style={styles.metricLabel}>completed</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Collection mix</Text>
        <Text style={styles.body}>Plastic • 40%</Text>
        <Text style={styles.body}>Organic • 35%</Text>
        <Text style={styles.body}>Bulk • 25%</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 10 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  metricRow: { flexDirection: "row", alignItems: "baseline", gap: 8, marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: "800", color: colors.secondary },
  metricLabel: { fontSize: 14, color: colors.muted },
});
