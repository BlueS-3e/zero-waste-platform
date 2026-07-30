import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { BrandHeader } from "@/components/common/BrandHeader";

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Pickup History" showLogout showBack />
      <Text style={styles.subtitle}>Your completed and cancelled pickups.</Text>

      <Card>
        <Text style={styles.cardTitle}>No history yet</Text>
        <Text style={styles.body}>Once pickups are completed, they will appear here.</Text>
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
