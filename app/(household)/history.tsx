import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>History</Text>
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
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
