import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { BrandHeader } from "@/components/common/BrandHeader";

export default function EarningsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Earnings" showLogout showBack />
      <Text style={styles.subtitle}>Your completed jobs and payout summary.</Text>

      <Card>
        <Text style={styles.cardTitle}>Today</Text>
        <Text style={styles.body}>Completed pickups: 2</Text>
        <Text style={styles.body}>Estimated payout: $24.00</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
